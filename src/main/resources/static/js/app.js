
/* =============================
   VALORANT IA - INTERACTIONS
   ============================= */

const STORAGE_KEY = "valorantIA";

const agents = {
    Phoenix: {
        emoji: "🔥",
        description: "Énergique et confiant"
    },
    Yoru: {
        emoji: "🌀",
        description: "Provocateur et rusé"
    },
    Skye: {
        emoji: "🌿",
        description: "Encourageante et positive"
    },
    Chamber: {
        emoji: "🎯",
        description: "Élégant et précis"
    },
    Jett: {
        emoji: "💨",
        description: "Rapide et compétitive"
    },
    Sage: {
        emoji: "❄️",
        description: "Calme et bienveillante"
    }
};

const defaultState = {
    protocol: "alpha",
    premium: false,
    agent: "Phoenix",
    currentId: null,
    conversations: []
};

let state = chargerEtat();

function chargerEtat() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

        if (saved && Array.isArray(saved.conversations)) {
            return { ...defaultState, ...saved };
        }
    } catch (error) {
        console.warn("Sauvegarde locale invalide.", error);
    }

    return { ...defaultState };
}

function sauvegarder() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}

/* =============================
   ALPHA / OMEGA
   ============================= */

function changerProtocole(protocol) {
    if (!["alpha", "omega"].includes(protocol)) return;

    state.protocol = protocol;
    sauvegarder();
    appliquerProtocole();
}

function appliquerProtocole() {
    document.body.classList.remove("alpha", "omega");
    document.body.classList.add(state.protocol);

    const alphaBtn = document.getElementById("alphaBtn");
    const omegaBtn = document.getElementById("omegaBtn");
    const label = document.getElementById("protocolLabel");

    alphaBtn?.classList.toggle(
        "active", state.protocol === "alpha"
    );

    omegaBtn?.classList.toggle(
        "active", state.protocol === "omega"
    );

    if (label) {
        label.textContent =
            state.protocol === "alpha" ? "Alpha" : "Omega";
    }
}

/* =============================
   PREMIUM ET AGENTS
   ============================= */

function changerPremium() {
    const toggle = document.getElementById("premiumToggle");
    if (!toggle) return;

    state.premium = toggle.checked;

    if (!state.premium) {
        state.agent = "Phoenix";
    }

    sauvegarder();
    actualiserAgents();
}

function actualiserAgents() {
    const select = document.getElementById("agentSelect");
    const toggle = document.getElementById("premiumToggle");

    if (toggle) {
        toggle.checked = state.premium;
    }

    if (!select) return;

    if (!state.premium && state.agent !== "Phoenix") {
        state.agent = "Phoenix";
    }

    for (const option of select.options) {
        const gratuit = option.value === "Phoenix";

        option.disabled = !gratuit && !state.premium;
        option.textContent = gratuit
            ? "Phoenix — Gratuit"
            : `${option.value} — ${state.premium
                ? "Premium"
                : "🔒 Premium"}`;
    }

    select.value = state.agent;
    afficherAgent();
}

function changerAgent() {
    const select = document.getElementById("agentSelect");
    if (!select) return;

    const agent = select.value;

    if (agent !== "Phoenix" && !state.premium) {
        select.value = "Phoenix";
        alert("Cet agent nécessite Premium.");
        return;
    }

    state.agent = agent;
    sauvegarder();
    afficherAgent();
}

function afficherAgent() {
    const badge = document.getElementById("agentBadge");
    const name = document.getElementById("agentName");
    const access = document.getElementById("agentAccess");

    if (badge) badge.textContent = agents[state.agent].emoji;
    if (name) name.textContent = state.agent;

    if (access) {
        access.textContent =
            state.agent === "Phoenix" ? "Gratuit" : "Premium";
    }
}

/* =============================
   CONVERSATIONS
   ============================= */

function conversationActuelle() {
    return state.conversations.find(
        c => c.id === state.currentId
    );
}

function nouvelleConversation() {
    state.currentId = null;
    state.agent = "Phoenix";

    sauvegarder();
    actualiserAgents();
    afficherMessages();
    afficherHistorique();

    // Sur une autre page, revenir au chat.
    if (!document.getElementById("chatForm")) {
        window.location.href = "/chat";
    }
}

function creerConversation(texte) {
    const conversation = {
        id: Date.now().toString() +
            Math.random().toString(36).slice(2, 7),
        title: texte.slice(0, 35),
        agent: state.agent,
        messages: []
    };

    state.conversations.unshift(conversation);
    state.currentId = conversation.id;

    return conversation;
}

function ouvrirConversation(id) {
    const conversation = state.conversations.find(
        c => c.id === id
    );

    if (!conversation) return;

    state.currentId = id;

    state.agent = state.premium ||
    conversation.agent === "Phoenix"
        ? conversation.agent
        : "Phoenix";

    sauvegarder();
    actualiserAgents();
    afficherMessages();
    afficherHistorique();
}

function supprimerConversation(id) {
    state.conversations = state.conversations.filter(
        c => c.id !== id
    );

    if (state.currentId === id) {
        state.currentId = null;
    }

    sauvegarder();
    afficherHistorique();
    afficherMessages();
}

function afficherHistorique() {
    const container = document.getElementById("historique");
    if (!container) return;

    container.replaceChildren();

    if (state.conversations.length === 0) {
        const p = document.createElement("p");
        p.className = "muted";
        p.textContent = "Aucune conversation";
        container.appendChild(p);
        return;
    }

    for (const conversation of state.conversations) {
        const row = document.createElement("div");
        row.className = "history-item";

        if (conversation.id === state.currentId) {
            row.classList.add("selected");
        }

        const open = document.createElement("button");
        open.type = "button";
        open.className = "history-open";
        open.textContent = "💬 " + conversation.title;
        open.onclick = () => ouvrirConversation(conversation.id);

        const del = document.createElement("button");
        del.type = "button";
        del.className = "history-delete";
        del.textContent = "×";
        del.title = "Supprimer la conversation";
        del.onclick = () => supprimerConversation(conversation.id);

        row.append(open, del);
        container.appendChild(row);
    }
}

/* =============================
   MESSAGES DU CHAT
   ============================= */

const spikeSVG = `
<svg viewBox="0 0 64 80" aria-hidden="true">
    <path d="M20 7 L44 7 L51 21 L44 30
             L49 65 L32 75 L15 65 L20 30
             L13 21 Z"
          fill="#36333e"
          stroke="currentColor"
          stroke-width="3"/>
    <path d="M17 20 L25 11 L39 11 L47 20
             L39 27 L25 27 Z"
          fill="#d9d8df"/>
    <path d="M27 31 L37 31 L37 61 L27 61 Z"
          fill="currentColor"/>
</svg>`;

function afficherMessages() {
    const container = document.getElementById("messages");
    const welcome = document.getElementById("welcome");

    if (!container) return;

    container.replaceChildren();

    const conversation = conversationActuelle();
    const messages = conversation?.messages || [];

    if (welcome) {
        welcome.style.display =
            messages.length === 0 ? "block" : "none";
    }

    for (const message of messages) {
        const row = document.createElement("div");
        row.className = "message " + message.role;

        if (message.role === "assistant") {
            const avatar = document.createElement("div");
            avatar.className = "assistant-avatar";
            avatar.innerHTML = spikeSVG;
            row.appendChild(avatar);
        }

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.textContent = message.content;

        row.appendChild(bubble);
        container.appendChild(row);
    }

    const scroll = document.getElementById("chatContent");
    if (scroll) {
        scroll.scrollTop = scroll.scrollHeight;
    }
}


/* =============================
   CHAT CONNECTÉ AU BACKEND DU TP
   ============================= */

let envoiEnCours = false;
let modeleMistralCache = null;

function afficherErreurChat(message) {
    console.error(message);
    const node = document.getElementById("chatError");
    if (node) {
        node.textContent = message;
        node.hidden = false;
    } else {
        alert(message);
    }
}

function effacerErreurChat() {
    const node = document.getElementById("chatError");
    if (node) {
        node.hidden = true;
        node.textContent = "";
    }
}

// Le ChatController de l'étape 10 sert le template utilisateur/chat.html sur GET /.
// Ce template contient le select des modèles chargés depuis ModeleIADAO.
async function chargerModeleMistral() {
    if (modeleMistralCache) return modeleMistralCache;
    const reponse = await fetch("/", { credentials: "same-origin" });
    if (!reponse.ok) throw new Error(`GET / renvoie HTTP ${reponse.status}`);
    const page = new DOMParser().parseFromString(await reponse.text(), "text/html");
    const choix = [...page.querySelectorAll('select[name="idModele"] option')]
        .find(o => o.value && /mistral/i.test(o.textContent));
    if (!choix) {
        throw new Error("Impossible de trouver Mistral sur GET /. Vérifie que ChatController.accueil() renvoie utilisateur/chat avec les modèles de MariaDB.");
    }
    modeleMistralCache = {
        id: choix.value,
        csrf: page.querySelector('input[name="_csrf"]')?.value ||
            page.querySelector('meta[name="_csrf"]')?.content || null
    };
    return modeleMistralCache;
}

async function envoyerMessage(texte) {
    texte = String(texte || "").trim();
    if (!texte || envoiEnCours) return;
    envoiEnCours = true;
    effacerErreurChat();
    const btn = document.querySelector('#chatForm button[type="submit"]');
    if (btn) btn.disabled = true;
    const champ = document.getElementById("messageInput");

    // Une conversation locale de l'ancienne maquette n'a pas d'identifiant MariaDB.
    const ancienne = conversationActuelle();
    const backendId = ancienne?.backendId || null;
    let conversation = backendId ? ancienne : null;
    let transitoire = false;

    try {
        // Envoi en formulaire classique vers les routes existantes du TP.
        const modele = await chargerModeleMistral();
        const donnees = new URLSearchParams();
        donnees.set("prompt", texte);
        if (!backendId) donnees.set("idModele", modele.id);
        if (modele.csrf) donnees.set("_csrf", modele.csrf);

        // Affiche immédiatement la question mais pas de réponse simulée.
        if (!conversation) {
            conversation = creerConversation(texte);
            transitoire = true;
        }
        conversation.messages.push({ role: "user", content: texte });
        afficherHistorique();
        afficherMessages();

        const cible = backendId
            ? `/conversations/${encodeURIComponent(backendId)}/messages`
            : "/conversations";
        const reponse = await fetch(cible, {
            method: "POST",
            credentials: "same-origin",
            redirect: "follow",
            headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
            body: donnees
        });
        if (!reponse.ok) throw new Error(`Le serveur a renvoyé HTTP ${reponse.status} pour ${cible}.`);

        const chemin = new URL(reponse.url).pathname;
        const match = chemin.match(/^\/conversations\/(\d+)\/?$/);
        if (!match) {
            throw new Error(`Redirection inattendue (${chemin}). Vérifie les routes du ChatController.`);
        }
        const idReel = Number(match[1]);
        const page = new DOMParser().parseFromString(await reponse.text(), "text/html");
        const noeuds = [...page.querySelectorAll(".message-content")];
        if (!noeuds.length) {
            throw new Error("La page serveur ne contient aucun .message-content. Vérifie utilisateur/chat.html.");
        }
        const messages = noeuds.map(el => ({
            role: el.parentElement?.querySelector("strong")?.textContent.trim().toUpperCase().includes("ASSISTANT")
                ? "assistant" : "user",
            content: el.textContent || ""
        }));
        conversation.backendId = idReel;
        conversation.messages = messages;
        sauvegarder();
        afficherHistorique();
        afficherMessages();
        if (!messages.some(m => m.role === "assistant")) {
            afficherErreurChat("Ta question est enregistrée dans MariaDB mais aucune réponse IA n'est présente. Regarde l'erreur Mistral dans la console IntelliJ (ChatController catch).");
        } else if (champ) {
            champ.value = "";
        }
    } catch (erreur) {
        // Ne pas présenter un échec API comme une réponse réussie.
        if (conversation) {
            conversation.messages = conversation.messages.filter((m, i, a) =>
                !(i === a.length - 1 && m.role === "user" && m.content === texte));
            if (transitoire && !conversation.backendId) {
                state.conversations = state.conversations.filter(c => c !== conversation);
                state.currentId = null;
            }
            sauvegarder();
            afficherHistorique();
            afficherMessages();
        }
        afficherErreurChat("Envoi impossible : " + erreur.message);
    } finally {
        envoiEnCours = false;
        if (btn) btn.disabled = false;
        champ?.focus();
    }
}

function questionRapide(question) { envoyerMessage(question); }

/* =============================
   INITIALISATION
   ============================= */
document.addEventListener("DOMContentLoaded", () => {
    appliquerProtocole();
    actualiserAgents();
    afficherHistorique();
    afficherMessages();
    const form = document.getElementById("chatForm");
    const input = document.getElementById("messageInput");
    if (form && input) {
        form.addEventListener("submit", event => {
            event.preventDefault();
            envoyerMessage(input.value);
        });
        input.addEventListener("keydown", event => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                form.requestSubmit();
            }
        });
    }
});

/* Affichage du bouton administrateur */

document.addEventListener("DOMContentLoaded", () => {
    const adminLink = document.getElementById("adminLink");

    if (adminLink) {
        adminLink.hidden =
            localStorage.getItem("valorantDemoRole") !== "admin";
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const profileName = document.getElementById("profileName");

    const role = localStorage.getItem("valorantDemoRole");

    if (profileName) {
        const labels = {
            admin: "Administrateur",
            premium: "Premium",
            user: "Utilisateur"
        };

        profileName.textContent = labels[role] || "Utilisateur";
    }
});

function deconnexion() {
    // Supprimer le profil de démonstration
    localStorage.removeItem("valorantDemoRole");
    localStorage.removeItem("valorantPseudo");

    // Désactiver le Premium
    state.premium = false;
    state.agent = "Phoenix";
    state.currentId = null;

    sauvegarder();

    // Retour à la connexion de la maquette (si route existante).
    window.location.assign("/connexion");
}

/* Affichage des onglets selon le profil */

document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("valorantDemoRole");

    const premiumLink = document.getElementById("premiumLink");
    const adminLink = document.getElementById("adminLink");

    // Premium : uniquement Premium et Admin
    if (premiumLink) {
        premiumLink.hidden =
            role !== "premium" && role !== "admin";
    }

    // Administration : uniquement Admin
    if (adminLink) {
        adminLink.hidden = role !== "admin";
    }
});


/* ==============================
   VALORANT IA - PANEL ADMIN
   ============================== */

const ADMIN_STORAGE_KEY = "valorantAIAdminConfig";

const defaultAdminConfig = {
    model: "gpt-4.1-mini",
    temperature: 0.7,
    enabled: true,
    historyEnabled: true,
    prompt: "Tu es Valorant IA, un assistant spécialisé dans le jeu Valorant. Tu aides les joueurs à progresser en expliquant les stratégies, les mécaniques, les rôles des agents et les bonnes pratiques. Tu adaptes ton ton à la personnalité de l'agent sélectionné, sans inventer de statistiques."
};

function lireConfigAdmin() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(ADMIN_STORAGE_KEY)
        );

        return {
            ...defaultAdminConfig,
            ...(saved || {})
        };
    } catch {
        return { ...defaultAdminConfig };
    }
}

function remplirPanelAdmin(config) {
    document.getElementById("aiModel").value = config.model;
    document.getElementById("aiTemperature").value =
        config.temperature;

    document.getElementById("temperatureValue").textContent =
        Number(config.temperature).toFixed(1);

    document.getElementById("aiEnabled").checked =
        config.enabled;

    document.getElementById("historyEnabled").checked =
        config.historyEnabled;

    document.getElementById("aiPrompt").value =
        config.prompt;

    document.getElementById("adminProtocol").textContent =
        state.protocol === "alpha" ? "Alpha" : "Omega";
}

function enregistrerConfigAdmin() {
    const config = {
        model: document.getElementById("aiModel").value,
        temperature: Number(
            document.getElementById("aiTemperature").value
        ),
        enabled: document.getElementById("aiEnabled").checked,
        historyEnabled:
        document.getElementById("historyEnabled").checked,
        prompt: document.getElementById("aiPrompt").value
    };

    localStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify(config)
    );

    document.getElementById("adminFeedback").textContent =
        "Paramètres de démonstration enregistrés !";
}

function reinitialiserConfigAdmin() {
    localStorage.removeItem(ADMIN_STORAGE_KEY);

    remplirPanelAdmin(defaultAdminConfig);

    document.getElementById("adminFeedback").textContent =
        "Paramètres réinitialisés.";
}

document.addEventListener("DOMContentLoaded", () => {
    const adminPage = document.querySelector(
        ".admin-page:not(.admin-model-page)"
    );

    // Ne rien faire sur les autres pages.
    if (!adminPage) return;

    // Contrôle du profil de démonstration.
    const role = localStorage.getItem("valorantDemoRole");

    if (role !== "admin") {
        window.location.replace("/chat");
        return;
    }

    remplirPanelAdmin(lireConfigAdmin());

    document.getElementById("aiTemperature")
        .addEventListener("input", event => {
            document.getElementById("temperatureValue")
                .textContent =
                Number(event.target.value).toFixed(1);
        });

    document.getElementById("saveAdmin")
        .addEventListener("click", enregistrerConfigAdmin);

    document.getElementById("resetAdmin")
        .addEventListener("click", reinitialiserConfigAdmin);
});

/* =============================
   VALORANT IA - PAGE PREMIUM
   ============================= */

document.addEventListener("DOMContentLoaded", () => {

    const premiumPage = document.querySelector(".premium-page");

    // Ne rien faire sur les autres pages
    if (!premiumPage) return;

    const role = localStorage.getItem("valorantDemoRole");

    // Profil Premium ou Admin obligatoire pour la démo
    if (role !== "premium" && role !== "admin") {
        window.location.replace("/chat");
        return;
    }

    const cards = document.querySelectorAll(
        ".premium-agent-card"
    );

    const selectedLabel = document.getElementById(
        "premiumSelectedAgent"
    );

    const feedback = document.getElementById(
        "premiumFeedback"
    );

    function afficherSelectionPremium() {

        cards.forEach(card => {
            const selected =
                card.dataset.agent === state.agent;

            card.classList.toggle("selected", selected);
            card.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });

        selectedLabel.textContent = state.agent;
    }

    // Cliquer sur un agent
    cards.forEach(card => {

        card.addEventListener("click", () => {

            const agent = card.dataset.agent;

            if (!Object.hasOwn(agents, agent)) return;

            state.agent = agent;
            state.premium = true;

            sauvegarder();
            afficherSelectionPremium();

            feedback.textContent =
                agent + " est maintenant sélectionné.";
        });
    });

    // Ouvrir le chat
    document.getElementById("premiumStartChat")
        .addEventListener("click", () => {

            state.premium = true;
            sauvegarder();

            window.location.href = "/chat";
        });

    // Charger la dernière personnalité choisie
    if (!Object.hasOwn(agents, state.agent)) {
        state.agent = "Phoenix";
        sauvegarder();
    }

    afficherSelectionPremium();

});