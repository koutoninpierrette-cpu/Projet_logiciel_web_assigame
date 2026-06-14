package com.esgis2026.assigame.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "boutique")
public class Boutique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_boutique;

    @Column(nullable = false, unique = true, length = 60)
    private String nom_boutique;

    @Column(nullable = true, length = 255)
    private String description;

    @Column(nullable = true, length = 255)
    private String logo;

    @Column(nullable = false)
    private LocalDateTime date_creation;

    @Column(nullable = false, length = 20)
    private String statut;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Utilisateur utilisateur;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id_boutique == null) ? 0 : id_boutique.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Boutique other = (Boutique) obj;
        if (id_boutique == null) {
            if (other.id_boutique != null)
                return false;
        } else if (!id_boutique.equals(other.id_boutique))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Boutique [id_boutique=" + id_boutique + ", nom_boutique=" + nom_boutique + ", description="
                + description + ", logo=" + logo + ", date_creation=" + date_creation + ", statut=" + statut
                + ", utilisateur=" + utilisateur + "]";
    }
}
