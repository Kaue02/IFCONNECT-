package com.ifconnect.api.AuxAluno;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "auxAluno")
public class AuxAluno {
	
	@Id
	private String matricula;
	
}
