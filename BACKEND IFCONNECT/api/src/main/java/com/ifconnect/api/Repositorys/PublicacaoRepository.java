package com.ifconnect.api.Repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifconnect.api.Publicacao.Publicacao;

@Repository
public interface PublicacaoRepository extends JpaRepository<Publicacao, Long> {

	List<Publicacao> findByUsuarioId(Long usuarioId);

}
