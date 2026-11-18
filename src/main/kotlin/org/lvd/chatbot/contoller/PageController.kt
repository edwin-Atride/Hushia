package org.lvd.chatbot.contoller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class PageController {



    @GetMapping("/connexion")
    fun connexion(): String {
        return "auth/connexion"
    }

    @GetMapping("/chat")
    fun chat(): String {
        return "accueil"
    }

    // Page d'administration
    @GetMapping("/admin")
    fun admin(): String {
        return "admin/panel"
    }

    @GetMapping("/premium")
    fun premium(): String {
        return "utilisateur/premium"
    }

}
