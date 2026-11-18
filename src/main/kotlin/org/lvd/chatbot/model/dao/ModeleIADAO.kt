package org.lvd.chatbot.model.dao


import org.lvd.chatbot.model.entity.ModeleIA
import org.springframework.data.jpa.repository.JpaRepository

interface ModeleIADAO : JpaRepository<ModeleIA, Long> {
}
