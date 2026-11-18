
package org.lvd.chatbot.model.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
class Message(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(columnDefinition = "TEXT", nullable = false)
    var contenu: String,

    var dateCreation: LocalDateTime,

    @Enumerated(EnumType.STRING)
    var typeMessage: TypeMessage,

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    var conversation: Conversation
) {
}
