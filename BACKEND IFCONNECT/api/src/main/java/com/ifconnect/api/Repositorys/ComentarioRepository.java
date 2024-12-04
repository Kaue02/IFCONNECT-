package com.ifconnect.api.Repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifconnect.api.Comentario.Comentario;
import com.ifconnect.api.Publicacao.Publicacao;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
	List<Comentario> findByPublicacao(Publicacao publicacao);

}