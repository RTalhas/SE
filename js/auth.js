(function () {
    if (typeof auth === 'undefined' || typeof db === 'undefined') {
        console.error('Firebase nao foi inicializado. Verifique js/firebase-config.js.');
        return;
    }

    var loginForm = document.getElementById('loginForm');
    var loginMessage = document.getElementById('loginMessage');
    if (!loginForm) {
        return;
    }

    var rolePages = {
        user: 'dashboard-user.html',
        technician: 'dashboard-technician.html',
        manager: 'dashboard-manager.html',
        admin: 'dashboard-admin.html'
    };

    var isRedirecting = false;

    auth.onAuthStateChanged(function (user) {
        if (user) {
            handleAuthenticatedUser(user);
        }
    });

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var email = (loginForm.email ? loginForm.email.value : '').trim();
        var password = loginForm.password ? loginForm.password.value : '';

        if (!email || !password) {
            showMessage('Preencha email e palavra-passe.', true);
            return;
        }

        showMessage('A autenticar...');

        auth.signInWithEmailAndPassword(email, password)
            .then(function (credential) {
                handleAuthenticatedUser(credential.user);
            })
            .catch(function (error) {
                isRedirecting = false;
                showMessage(normalizeError(error), true);
            });
    });

    function showMessage(message, isError) {
        if (!loginMessage) {
            return;
        }
        loginMessage.textContent = message || '';
        loginMessage.style.minHeight = message ? '1.5rem' : '0';
        loginMessage.style.color = isError ? '#b91c1c' : '#475569';
    }

    function getPageForRole(role) {
        return rolePages[role] || rolePages.user;
    }

    function handleAuthenticatedUser(user) {
        if (!user || isRedirecting) {
            return;
        }

        isRedirecting = true;
        showMessage('A preparar o seu dashboard...');

        ensureUserRole(user)
            .then(function (role) {
                window.location.href = getPageForRole(role);
            })
            .catch(function (error) {
                isRedirecting = false;
                showMessage(normalizeError(error), true);
            });
    }

    function ensureUserRole(user) {
        var userRef = db.collection('users').doc(user.uid);
        return userRef.get().then(function (snapshot) {
            if (!snapshot.exists) {
                return userRef.set({
                    email: user.email || '',
                    role: 'user',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function () {
                    return 'user';
                });
            }

            var data = snapshot.data() || {};
            var updates = {};

            if (!data.email && user.email) {
                updates.email = user.email;
            }

            if (!data.role) {
                updates.role = 'user';
            }

            if (!data.createdAt) {
                updates.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            }

            var role = data.role || 'user';

            if (Object.keys(updates).length > 0) {
                return userRef.set(updates, { merge: true }).then(function () {
                    return role;
                });
            }

            return role;
        });
    }

    function normalizeError(error) {
        if (!error) {
            return 'Ocorreu um erro inesperado. Tente novamente.';
        }

        var messages = {
            'auth/invalid-credential': 'Credenciais invalidas. Confirme o email e a palavra-passe.',
            'auth/invalid-email': 'O formato do email nao e valido.',
            'auth/user-disabled': 'Esta conta foi desativada pelo administrador.',
            'auth/user-not-found': 'Nao encontramos uma conta com esse email.',
            'auth/wrong-password': 'Palavra-passe incorreta.',
            'auth/too-many-requests': 'Muitas tentativas falhadas. Aguarde e tente de novo.'
        };

        if (messages[error.code]) {
            return messages[error.code];
        }

        return error.message || 'Ocorreu um erro inesperado. Tente novamente.';
    }
})();
