package com.pl.premier_zone.player;

import jakarta.persistence.*;

@Entity
@Table(name = "player_statistic")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String nation;
    private String position;
    private Integer age;
    private Integer matPlayed;
    private Integer starts;
    private Double minPlayed;
    private Double goals;
    private Double assists;
    private Double penScored;
    private Double yCards;
    private Double rCards;
    private Double expGoals;
    private Double expAssists;
    private String teamName;

    public Player() {}

    // Getters & Setters

    public Long getId() { return id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getNation() { return nation; }

    public void setNation(String nation) { this.nation = nation; }

    public String getPosition() { return position; }

    public void setPosition(String position) { this.position = position; }

    public Integer getAge() { return age; }

    public void setAge(Integer age) { this.age = age; }

    public Integer getMatPlayed() { return matPlayed; }

    public void setMatPlayed(Integer matPlayed) { this.matPlayed = matPlayed; }

    public Integer getStarts() { return starts; }

    public void setStarts(Integer starts) { this.starts = starts; }

    public Double getMinPlayed() { return minPlayed; }

    public void setMinPlayed(Double minPlayed) { this.minPlayed = minPlayed; }

    public Double getGoals() { return goals; }

    public void setGoals(Double goals) { this.goals = goals; }

    public Double getAssists() { return assists; }

    public void setAssists(Double assists) { this.assists = assists; }

    public Double getPenScored() { return penScored; }

    public void setPenScored(Double penScored) { this.penScored = penScored; }

    public Double getyCards() { return yCards; }

    public void setyCards(Double yCards) { this.yCards = yCards; }

    public Double getrCards() { return rCards; }

    public void setrCards(Double rCards) { this.rCards = rCards; }

    public Double getExpGoals() { return expGoals; }

    public void setExpGoals(Double expGoals) { this.expGoals = expGoals; }

    public Double getExpAssists() { return expAssists; }

    public void setExpAssists(Double expAssists) { this.expAssists = expAssists; }

    public String getTeamName() { return teamName; }

    public void setTeamName(String teamName) { this.teamName = teamName; }
}