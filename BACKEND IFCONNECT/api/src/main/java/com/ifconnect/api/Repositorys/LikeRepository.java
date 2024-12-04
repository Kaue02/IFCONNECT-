package com.ifconnect.api.Repositorys;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ifconnect.api.Like.Like;
import com.ifconnect.api.Publicacao.Publicacao;
import com.ifconnect.api.Usuario.Usuario;

public interface LikeRepository extends JpaRepository<Like, Long>{
    
    boolean existsByUsuarioAndPublicacao(Usuario usuario, Publicacao publicacao);
    Optional<Like> findByUsuarioAndPublicacao(Usuario usuario, Publicacao publicacao);
    @Query("SELECT l.usuario FROM Like l WHERE l.publicacao = :publicacao")
    List<Usuario> findUsuariosByPublicacao(Publicacao publicacao);
    
    // Método para contar o número de likes de uma publicação
    long countByPublicacao(Publicacao publicacao);
}

