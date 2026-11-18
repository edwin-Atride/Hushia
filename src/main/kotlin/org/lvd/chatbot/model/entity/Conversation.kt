
package org.lvd.chatbot.model.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
class Conversation(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(nullable = false)
    var titre: String,

    @Column(nullable = false)
    var dateCreation: LocalDateTime,

    @Column(nullable = false)
    var dateModification: LocalDateTime,

    @OneToMany(mappedBy = "conversation")
    var messages: MutableList<Message> = mutableListOf(),

    @ManyToOne
    @JoinColumn(name = "modele_ia_id", nullable = false)
    val modeleIA: ModeleIA
) {
}
