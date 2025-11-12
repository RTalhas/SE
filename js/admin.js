(function () {
    if (typeof firebase === 'undefined' || typeof auth === 'undefined' || typeof db === 'undefined') {
        console.warn('Firebase nao foi inicializado para admin.js');
        return;
    }

    var body = document.body;
    if (!body || body.getAttribute('data-required-role') !== 'admin') {
        return;
    }

    var createUserForm = document.getElementById('createUserForm');
    var createUserMessage = document.getElementById('createUserMessage');
    var usersTableBody = document.getElementById('usersTableBody');
    var unsubscribeUsers = null;

    init();

    // Inicializa listeners/subscricoes quando o dashboard carrega
    function init() {
        subscribeUsers();
        if (createUserForm) {
            createUserForm.addEventListener('submit', handleCreateUser);
        }
        window.addEventListener('beforeunload', cleanup);
    }

    // Liberta subscricoes quando o utilizador sai da pagina
    function cleanup() {
        if (typeof unsubscribeUsers === 'function') {
            unsubscribeUsers();
            unsubscribeUsers = null;
        }
    }

    // Processa o submit do formulario e cria uma conta nova
    function handleCreateUser(event) {
        event.preventDefault();

        var emailInput = document.getElementById('newUserEmail');
        var nameInput = document.getElementById('newUserName');
        var roleInput = document.getElementById('newUserRole');

        var email = (emailInput.value || '').trim().toLowerCase();
        var displayName = (nameInput.value || '').trim();
        var role = roleInput.value;

        if (!email || !displayName || !role) {
            showMessage('Preencha todos os campos antes de continuar.', true);
            return;
        }

        var tempPassword = generateTempPassword();
        showMessage('A criar conta para ' + email + '...', false, true);

        createFirebaseAccount(email, tempPassword)
            .then(function (uid) {
                return db.collection('users').doc(uid).set({
                    email: email,
                    displayName: displayName,
                    role: role,
                    invitedBy: auth.currentUser ? auth.currentUser.uid : null,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true }).then(function () {
                    return { uid: uid, password: tempPassword };
                });
            })
            .then(function (result) {
                createUserForm.reset();
                showMessage('Conta criada com sucesso! Palavra-passe temporaria: ' + result.password + '. Partilhe-a com o utilizador.', false);
            })
            .catch(function (error) {
                if (error && error.code === 'EMAIL_EXISTS') {
                    handleExistingUser(email, displayName, role);
                    return;
                }
                showMessage(normalizeError(error), true);
            });
    }

    // Atualiza role/metadata quando o email ja existe
    function handleExistingUser(email, displayName, role) {
        showMessage('Esse email ja existe. A procurar documento em Firestore...', false, true);
        db.collection('users')
            .where('email', '==', email)
            .limit(1)
            .get()
            .then(function (snapshot) {
                if (snapshot.empty) {
                    throw new Error('Email ja registado no Firebase Authentication, mas ainda nao possui documento em users/{uid}. Peca ao utilizador para iniciar sessao uma vez ou crie o doc manualmente com o UID.');
                }
                var ref = snapshot.docs[0].ref;
                return ref.set({
                    displayName: displayName,
                    role: role,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            })
            .then(function () {
                showMessage('Role atualizado para ' + role + ' no documento existente.', false);
            })
            .catch(function (err) {
                showMessage(normalizeError(err), true);
            });
    }

    // Observa a colecao users em tempo real e desenha a tabela
    function subscribeUsers() {
        if (!usersTableBody) {
            return;
        }
        usersTableBody.innerHTML = '<tr><td colspan="5">A carregar utilizadores...</td></tr>';
        unsubscribeUsers = db.collection('users')
            .orderBy('email')
            .limit(50)
            .onSnapshot(function (snapshot) {
                if (snapshot.empty) {
                    usersTableBody.innerHTML = '<tr><td colspan="5">Ainda nao existem utilizadores registados.</td></tr>';
                    return;
                }
                var rows = snapshot.docs.map(function (doc) {
                    var data = doc.data() || {};
                    var email = data.email || '--';
                    var name = data.displayName || data.name || '--';
                    var role = data.role || 'user';
                    var lastActivity = data.updatedAt || data.createdAt;
                    var lastSeen = formatTimestamp(lastActivity);
                    var statusBadge = 'badge';
                    if (role === 'admin') {
                        statusBadge += ' badge-open';
                    } else if (role === 'manager') {
                        statusBadge += ' badge-progress';
                    } else if (role === 'technician') {
                        statusBadge += ' badge-medium';
                    } else {
                        statusBadge += ' badge-low';
                    }
                    return '<tr>' +
                        '<td>' + escapeHtml(email) + '</td>' +
                        '<td>' + escapeHtml(name) + '</td>' +
                        '<td><span class="' + statusBadge + '">' + escapeHtml(role) + '</span></td>' +
                        '<td>' + lastSeen + '</td>' +
                        '<td><span class="badge">' + (data.active === false ? 'inativo' : 'ativo') + '</span></td>' +
                        '</tr>';
                }).join('');
                usersTableBody.innerHTML = rows;
            }, function (error) {
                usersTableBody.innerHTML = '<tr><td colspan="5">Erro ao carregar utilizadores.</td></tr>';
                console.error('Erro ao subscrever utilizadores', error);
            });
    }

    // Usa a REST API de Auth para criar contas sem trocar a sessao ativa
    function createFirebaseAccount(email, password) {
        var apiKey = (firebase.app().options || {}).apiKey;
        if (!apiKey) {
            return Promise.reject(new Error('API key do Firebase nao encontrada.'));
        }
        var url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + encodeURIComponent(apiKey);
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password, returnSecureToken: true })
        })
            .then(function (response) {
                if (!response.ok) {
                    return response.json().then(function (data) {
                        var message = data && data.error && data.error.message ? data.error.message : 'Erro ao criar conta.';
                        var error = new Error(message);
                        error.code = message;
                        throw error;
                    });
                }
                return response.json();
            })
            .then(function (result) {
                if (!result || !result.localId) {
                    throw new Error('Resposta inesperada do Firebase ao criar conta.');
                }
                return result.localId;
            });
    }

    // Gera uma palavra-passe temporaria aleatoria
    function generateTempPassword() {
        var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@$!%*?&';
        var pass = '';
        for (var i = 0; i < 12; i += 1) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    }

    // Mostra mensagens de feedback junto ao formulario
    function showMessage(message, isError, keepVisible) {
        if (!createUserMessage) {
            return;
        }
        createUserMessage.textContent = message || '';
        createUserMessage.style.color = isError ? '#b91c1c' : '#475569';
        if (!keepVisible && !isError && message) {
            setTimeout(function () {
                createUserMessage.textContent = '';
            }, 8000);
        }
    }

    // Converte timestamps do Firestore num formato breve legivel
    function formatTimestamp(ts) {
        if (!ts || typeof ts.toDate !== 'function') {
            return '--';
        }
        var date = ts.toDate();
        return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
            date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    }

    // Escapa strings antes de as injetar na tabela (evita XSS)
    function escapeHtml(value) {
        if (!value) {
            return '';
        }
        return value.replace(/[&<>"']/g, function (char) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
        });
    }

    // Normaliza/corrige mensagens de erro vindas das APIs do Firebase
    function normalizeError(error) {
        if (!error) {
            return 'Ocorreu um erro inesperado. Tente novamente.';
        }
        var message = error.message || error.code || error.toString();
        if (message === 'EMAIL_EXISTS' || message === 'auth/email-already-in-use') {
            return 'Este email ja se encontra registado. Atualize o role no Firestore ou gere uma palavra-passe nova no Firebase Authentication.';
        }
        if (message === 'permission-denied' || (message.indexOf && message.indexOf('insufficient permissions') >= 0)) {
            return 'Sem permissao para aceder ao Firestore. Confirme as regras e se o utilizador possui role admin.';
        }
        if (message.indexOf && message.indexOf('WEAK_PASSWORD') >= 0) {
            return 'A palavra-passe gerada foi considerada fraca. Tente novamente.';
        }
        return message;
    }
})();
