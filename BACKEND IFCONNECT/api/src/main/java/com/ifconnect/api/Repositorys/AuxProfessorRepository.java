package com.ifconnect.api.Repositorys;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifconnect.api.AuxProfessor.AuxProfessor;

public interface AuxProfessorRepository extends JpaRepository<AuxProfessor, String>{
	
	boolean existsByMatricula(String matricula);
	
}
