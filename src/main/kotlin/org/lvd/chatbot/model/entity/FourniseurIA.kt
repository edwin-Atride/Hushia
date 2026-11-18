
package org.lvd.chatbot.model.entity

import jakarta.persistence.*

@Entity
class FournisseurIA(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(nullable = false)
    var nom: String,

    var cheminLogo: String,

    var description: String,

    @OneToMany(mappedBy = "fournisseur")
    var modeles: MutableList<ModeleIA> = mutableListOf()
)
