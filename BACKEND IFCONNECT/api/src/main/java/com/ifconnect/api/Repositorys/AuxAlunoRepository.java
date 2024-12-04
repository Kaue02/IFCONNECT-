package com.ifconnect.api.Repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifconnect.api.AuxAluno.AuxAluno;

@Repository
public interface AuxAlunoRepository extends JpaRepository<AuxAluno, String>{
	
	boolean existsByMatricula(String matricula);
	
}
