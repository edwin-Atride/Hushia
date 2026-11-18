package org.lvd.chatbot.model.dao



import org.lvd.chatbot.model.entity.Message
import org.springframework.data.jpa.repository.JpaRepository

interface MessageDAO : JpaRepository<Message, Long> {
}
