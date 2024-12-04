package com.ifconnect.api.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifconnect.api.Comentario.Comentario;
import com.ifconnect.api.Comentario.DadosApagarComentario;
import com.ifconnect.api.Comentario.DadosCriacaoComentario;
import com.ifconnect.api.Comentario.DadosListarComentarios;
import com.ifconnect.api.Publicacao.Publicacao;
import com.ifconnect.api.Repositorys.ComentarioRepository;
import com.ifconnect.api.Repositorys.PublicacaoRepository;
import com.ifconnect.api.Repositorys.UsuarioRepository;
import com.ifconnect.api.Usuario.Usuario;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
@RestController
@RequestMapping("/comentarios")
public class ComentarioController {

	@Autowired
	private ComentarioRepository comentarioRepository;

	@Autowired
	private PublicacaoRepository publicacaoRepository;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@PostMapping()
	@Transactional
	public ResponseEntity<Comentario> criarComentario(@RequestBody DadosCriacaoComentario dtoComentario) {

		Long idUsuario = dtoComentario.idUsuarioComentario();
		Long idPublicacao = dtoComentario.idPublicacao();
		String texto = dtoComentario.texto();

		Usuario usuario = usuarioRepository.findById(idUsuario)
				.orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

		Publicacao publicacao = publicacaoRepository.findById(idPublicacao)
				.orElseThrow(() -> new EntityNotFoundException("Publicação não encontrada"));

		Comentario comentario = new Comentario();
		comentario.setTexto(texto);
		comentario.setUsuario(usuario);
		comentario.setPublicacao(publicacao);

		comentarioRepository.save(comentario);

		return ResponseEntity.status(HttpStatus.CREATED).body(comentario);
	}

	@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
	@GetMapping("/{idPublicacao}")
	public ResponseEntity<List<Comentario>> listarComentarios(@PathVariable Long idPublicacao) {
	    Publicacao publicacao = publicacaoRepository.findById(idPublicacao)
	            .orElseThrow(() -> new EntityNotFoundException("Publicação não encontrada"));

	    List<Comentario> comentarios = comentarioRepository.findByPublicacao(publicacao);

	    return ResponseEntity.ok(comentarios);
	}


	@DeleteMapping()
	public ResponseEntity<Void> deletarComentario(@RequestBody DadosApagarComentario dtoComentario) {
		Long idComentario = dtoComentario.idComentario();
		Comentario comentario = comentarioRepository.findById(idComentario)
				.orElseThrow(() -> new EntityNotFoundException("Comentário não encontrado"));

		comentarioRepository.delete(comentario);

		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}