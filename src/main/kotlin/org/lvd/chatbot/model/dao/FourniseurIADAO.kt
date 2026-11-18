package org.lvd.chatbot.model.dao


import org.lvd.chatbot.model.entity.FournisseurIA
import org.springframework.data.jpa.repository.JpaRepository

interface FournisseurIADAO : JpaRepository<FournisseurIA, Long> {
}
