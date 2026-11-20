package org.lvd.chatbot.service

import org.lvd.chatbot.model.entity.ModeleIA
import org.springframework.stereotype.Component

@Component
class IAServiceFactory(
    private val services: List<IAService>
) {

    fun getService(modele: ModeleIA): IAService {

        val fournisseur = modele.fournisseur.nom

        return services.firstOrNull {
            it.getFournisseur().equals(
                fournisseur,
                ignoreCase = true
            )
        } ?: throw IllegalArgumentException(
            "Aucun service disponible pour $fournisseur"
        )
    }
}