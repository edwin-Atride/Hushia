
package org.lvd.chatbot.model.entity

import jakarta.persistence.*

@Entity
class ModeleIA(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(nullable = false)
    var nom: String,

    var urlAPI: String,

    var description: String,

    var cheminLogo: String,

    @ManyToOne
    @JoinColumn(name = "fournisseur_id", nullable = false)
    var fournisseur: FournisseurIA,

    @OneToMany(mappedBy = "modeleIA")
    var conversations: MutableList<Conversation> = mutableListOf()
)
