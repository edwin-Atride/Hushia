
package org.lvd.chatbot.controller

import org.lvd.chatbot.model.dao.ModeleIADAO
import org.lvd.chatbot.service.IAService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ModeleDisponibleController(
    private val modeleIADAO: ModeleIADAO,
    private val services: List<IAService>
) {

    @GetMapping("/api/modeles-disponibles")
    fun obtenirModeles(): List<Map<String, Any>> {

        // Fournisseurs reconnus par Spring Boot
        val fournisseursDisponibles = services.map {
            it.getFournisseur().lowercase()
        }

        // Récupération des modèles depuis MariaDB
        return modeleIADAO.findAll()
            .filter { modele ->
                modele.fournisseur.nom.lowercase() in
                        fournisseursDisponibles
            }
            .map { modele ->
                mapOf(
                    "nom" to modele.nom,
                    "fournisseur" to modele.fournisseur.nom,
                    "identifiantAPI" to modele.nom,
                    "actif" to true
                )
            }
    }
}
