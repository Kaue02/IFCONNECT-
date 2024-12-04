package com.ifconnect.api.Repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifconnect.api.Usuario.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
		
	 Usuario findByMatriculaAndSenha(String matricula, String senha);
	 
	 Usuario findUsuarioById(Long id);
	
	 boolean existsByEmail(String email);
	
	 boolean existsByMatricula(String matricula);
	 
	 boolean existsByMatriculaAndSenha(String matricula, String senha);
	
}
