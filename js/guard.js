(function () {
    if (typeof auth === 'undefined' || typeof db === 'undefined') {
        console.error('Firebase nao foi inicializado. Verifique js/firebase-config.js.');
        return;
    }

    var requiredRole = document.body ? document.body.getAttribute('data-required-role') : null;
    if (!requiredRole) {
        return;
    }

    var headerUserRole = document.getElementById('headerUserRole');
    var headerUserEmail = document.getElementById('headerUserEmail');
    var logoutBtn = document.getElementById('logoutBtn');

    var rolePages = {
        user: 'dashboard-user.html',
        technician: 'dashboard-technician.html',
        manager: 'dashboard-manager.html',
        admin: 'dashboard-admin.html'
    };

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            logoutBtn.disabled = true;
            logoutBtn.textContent = 'A terminar...';
            auth.signOut()
                .catch(function (error) {
                    console.error('Erro ao terminar sessao', error);
                })
                .finally(function () {
                    redirectToLogin();
                });
        });
    }

    auth.onAuthStateChanged(function (user) {
        if (!user) {
            redirectToLogin();
            return;
        }

        if (headerUserEmail) {
            headerUserEmail.textContent = user.email || '';
        }

        fetchUserRole(user.uid, user.email)
            .then(function (role) {
                if (headerUserRole) {
                    headerUserRole.textContent = role;
                }

                if (requiredRole && role !== requiredRole) {
                    redirectToRole(role);
                }
            })
            .catch(function (error) {
                console.error('Erro ao validar role do utilizador', error);
                redirectToLogin();
            });
    });

    function fetchUserRole(uid, email) {
        var userRef = db.collection('users').doc(uid);
        return userRef.get().then(function (snapshot) {
            if (!snapshot.exists) {
                return userRef.set({
                    email: email || '',
                    role: 'user',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function () {
                    return 'user';
                });
            }

            var data = snapshot.data() || {};
            var role = data.role || 'user';

            if (!data.role) {
                return userRef.set({ role: 'user' }, { merge: true }).then(function () {
                    return 'user';
                });
            }

            return role;
        });
    }

    function redirectToLogin() {
        window.location.href = 'login.html';
    }

    function redirectToRole(role) {
        var target = rolePages[role] || rolePages.user;
        window.location.href = target;
    }
})();
