**Idle Game Design Document: Aventurier Progressif**

---

## 🌟 Concept Principal
Un jeu idle où le joueur incarne un aventurier solitaire qui progresse dans des zones de plus en plus difficiles, gagne de l'expérience, collecte des ressources, fabrique/améliore son équipement, et construit son build en choisissant ses compétences et talents. Le jeu est entièrement **déterministe** : aucun aléatoire dans les combats, les loots ou les systèmes de progression.

---

## ⚔️ Combat
- Le joueur sélectionne une **aventure active** (combat contre un type de monstre dans une zone donnée).
- Chaque combat est **automatique** et dure un certain temps, dépendant des stats de l'aventurier, de son équipement et des monstres.
- Les compétences actives sont utilisées **automatiquement**, selon un **ordre de priorité** défini par le joueur.
- **Pas de soin** possible, sauf en montant de niveau.
- La mort = **fin de run** et activation du système de prestige.

### Récompenses de combat
- ✨ XP (expérience)
- 💎 Ressources (matériaux pour craft)

---

## 🏠 Zones et Monstres
- Chaque **zone** est accessible après avoir vaincu le **boss de la zone précédente**.
- Dans chaque zone :
  - Un premier monstre est disponible dès le début.
  - On peut débloquer d'autres monstres (contre de l'or).
  - On peut augmenter le **nombre de monstres affrontés** par combat (coût croissant).
- Un **boss unique** à la fin de chaque zone doit être vaincu pour débloquer la suivante.

---

## 💼 Caractéristiques
Attribuables manuellement à chaque niveau :

| Caractéristique | Effets |
|------------------|--------|
| **Force**        | Bonus sur compétences + Réduction des dégâts subis |
| **Agilité**      | Bonus sur compétences + Réduction des cooldowns |
| **Intelligence** | Bonus sur compétences + Augmentation mana max + régénération |

**Mana** n'est **pas une stat attribuable**, elle augmente uniquement avec l'Intelligence.

---

## 🔧 Compétences

### Compétences Actives
- Débloquées via l'arbre de talent.
- Utilisent du mana.
- Ont un temps de recharge.
- Sont utilisées automatiquement dans l'ordre de priorité défini par le joueur.

**Exemples :**
- *Frappe simple* : Dégâts = X + (Force%) | Coût : 1 mana | CD : 5s - (Agilité%)
- *Pluie de feu* : AoE sur X + (Int%) ennemis | Coût : 5 mana | CD : 10s

### Compétences Passives
- Bonus de type : dégâts +X%, mana max +X, vitesse +X%, etc.
- Acquises via les arbres de talents.

---

## 📚 Arbres de Talents
- L'aventurier choisit une **classe** (voire une **double classe** si débloquée).
- Chaque classe a son propre **arbre de talent**.
- Les talents peuvent être **passifs** ou **actifs**.

Exemples de classes : Guerrier, Voleur, Mage...

---

## 💎 Ressources & Équipement

### Obtenir
- Gagnées lors des combats.
- Peuvent être **vendues** contre de l'or, ou utilisées pour **crafter** des équipements.

### Fabrication & Amélioration
- L'équipement se craft avec des ressources **prédictibles**.
- Chaque pièce a un **niveau d'amélioration max**, dépendant des compétences de fabrication.
- L'amélioration coûte des ressources **et** de l'or.

---

## 💰 Utilisation de l'or
- Débloquer de nouveaux monstres.
- Améliorer équipement.
- Acheter des améliorations spéciales :
  - Taille d'inventaire
  - Vente automatique (marchand itinérant)
  - Améliorations de confort ou stratégiques

---

## ☠️ Mort & Prestige
- Quand les PV atteignent 0, la partie redémarre (prestige).
- Le joueur conserve ses **points de destin** gagnés.

### Points de destin
- Dépend du niveau, zones débloquées, boss vaincus...
- Utilisables pour :
  - Acheter **artefacts passifs permanents**
  - Débloquer l'arbre du destin (bonus globaux)
  - Accès à de nouvelles classes ou à la double classe

---

## 🤟 Boss de Zone
- Un boss unique par zone, affrontable une seule fois par run.
- Récompense :
  - Points de destin bonus
  - Compétence passive unique ?
  - Débloque la zone suivante

---

Ce système est conçu pour être équilibré, profond et gratifiant sans jamais recourir à du hasard. Il combine des éléments de RPG classique, de gestion stratégique, et d'optimisation propre aux idle games.


