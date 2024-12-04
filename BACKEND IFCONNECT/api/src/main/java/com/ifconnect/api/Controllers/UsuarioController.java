package com.ifconnect.api.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifconnect.api.Enums.TiposUsuario;
import com.ifconnect.api.Repositorys.AuxAlunoRepository;
import com.ifconnect.api.Repositorys.AuxProfessorRepository;
import com.ifconnect.api.Repositorys.UsuarioRepository;
import com.ifconnect.api.Usuario.DadosAtualizacaoUsuario;
import com.ifconnect.api.Usuario.DadosCadastroUsuario;
import com.ifconnect.api.Usuario.DadosLoginUsuario;
import com.ifconnect.api.Usuario.Usuario;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

	@Autowired
	private UsuarioRepository repository;

	@Autowired
	private AuxAlunoRepository auxAlunoRepository;

	@Autowired
	private AuxProfessorRepository auxProfessorRepository;
	
	//@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
	@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
	@PostMapping
	public ResponseEntity<Usuario> criaUsuario(@RequestBody @Valid DadosCadastroUsuario dadosUsuario) {

		if (repository.existsByMatricula(dadosUsuario.matricula())
				|| !dadosUsuario.email().contains("academico.ifsul.edu.br")
				|| repository.existsByEmail(dadosUsuario.email())) {

			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}

		Usuario user = new Usuario();
		user.setEmail(dadosUsuario.email());
		user.setMatricula(dadosUsuario.matricula());
		user.setNome(dadosUsuario.nome());
		user.setSenha(dadosUsuario.senha());

		if (dadosUsuario.tipoUsuario().equals("Aluno")
				&& auxAlunoRepository.existsByMatricula(dadosUsuario.matricula())) {
			user.setTipoUsuario(TiposUsuario.ALUNO);
		} else if (dadosUsuario.tipoUsuario().equals("Professor")
				&& auxProfessorRepository.existsByMatricula(dadosUsuario.matricula())) {
			user.setTipoUsuario(TiposUsuario.PROFESSOR);
		} else {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}

		repository.save(user);
		return new ResponseEntity<>(user, HttpStatus.CREATED);
	}

	@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
	@PostMapping("/login")
	public ResponseEntity<Usuario> logaUsuario(@RequestBody @Valid DadosLoginUsuario dadosUsuario) {
		if (repository.existsByMatriculaAndSenha(dadosUsuario.matricula(), dadosUsuario.senha())) {
			var user = repository.findByMatriculaAndSenha(dadosUsuario.matricula(), dadosUsuario.senha());

			return new ResponseEntity<>(user, HttpStatus.OK);
		} else {
			return ResponseEntity.notFound().build();
		}

	}

	@GetMapping("/{id}")
	@Transactional
	public ResponseEntity<Usuario> verUsuario(@PathVariable Long id) {

		Usuario user = repository.findUsuarioById(id);

		return new ResponseEntity<>(user, HttpStatus.OK);
	}

	@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
	@PutMapping("/{id}")
	@Transactional
	public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id,
			@RequestBody @Valid DadosAtualizacaoUsuario dadosAtualizacao) {
		Usuario user = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

		user.atualizarDados(dadosAtualizacao);
		repository.save(user);
		return new ResponseEntity<>(user, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Usuario> deletarUsuario(@PathVariable Long id) {
		Usuario user = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

		repository.deleteById(user.getId());
		return ResponseEntity.noContent().build();
	}

}
