package com.ifconnect.api.Controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import com.ifconnect.api.Like.DadosLike;
import com.ifconnect.api.Like.Like;
import com.ifconnect.api.Publicacao.Publicacao;
import com.ifconnect.api.Repositorys.LikeRepository;
import com.ifconnect.api.Repositorys.PublicacaoRepository;
import com.ifconnect.api.Repositorys.UsuarioRepository;
import com.ifconnect.api.Usuario.Usuario;

@RestController
@RequestMapping("likes")
@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
public class LikeController {
	
	@Autowired
	private LikeRepository likeRepository;
	@Autowired
	private UsuarioRepository usuarioRepository;
	@Autowired
	private PublicacaoRepository publicacaoRepository;

	
	@PostMapping
	public ResponseEntity<Map<String, Object>> criarLike(@RequestBody DadosLike dados) {

		Usuario usuario = usuarioRepository.findById(dados.idUsuario())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));


		Publicacao publicacao = publicacaoRepository.findById(dados.idPublicacao())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Publicação não encontrada"));


		boolean likeJaExiste = likeRepository.existsByUsuarioAndPublicacao(usuario, publicacao);
		if (likeJaExiste) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Usuário já deu like nesta publicação");
		}

		Like like = new Like();
		like.setUsuario(usuario);
		like.setPublicacao(publicacao);
		likeRepository.save(like);

		long quantidadeLikes = likeRepository.countByPublicacao(publicacao);

	    Map<String, Object> response = new HashMap<>();
	    response.put("mensagem", "Like registrado com sucesso!");
	    response.put("quantidadeLikes", quantidadeLikes);
	    response.put("idPublicacao", publicacao.getId());

	    return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
	

	@DeleteMapping
	public ResponseEntity<Map<String, Object>> removerLike(@RequestBody DadosLike dados) {

		Usuario usuario = usuarioRepository.findById(dados.idUsuario())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
		
		Publicacao publicacao = publicacaoRepository.findById(dados.idPublicacao())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Publicação não encontrada"));

		Like like = likeRepository.findByUsuarioAndPublicacao(usuario, publicacao)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Like não encontrado"));

		likeRepository.delete(like);

		long quantidadeLikes = likeRepository.countByPublicacao(publicacao);

	    Map<String, Object> response = new HashMap<>();
	    response.put("mensagem", "Like removido com sucesso!");
	    response.put("quantidadeLikes", quantidadeLikes);
	    response.put("idPublicacao", publicacao.getId());

	    return ResponseEntity.ok(response);
	}
	

	@GetMapping("/publicacao/{idPublicacao}")
	public ResponseEntity<List<Usuario>> listarUsuariosQueDeramLike(@PathVariable Long idPublicacao) {
		Publicacao publicacao = publicacaoRepository.findById(idPublicacao)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Publicação não encontrada"));

		List<Usuario> usuarios = likeRepository.findUsuariosByPublicacao(publicacao);

		return ResponseEntity.ok(usuarios);
	}
}