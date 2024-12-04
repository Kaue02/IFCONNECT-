package com.ifconnect.api.Usuario;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ifconnect.api.Comentario.Comentario;
import com.ifconnect.api.Enums.TiposUsuario;
import com.ifconnect.api.Like.Like;
import com.ifconnect.api.Publicacao.Publicacao;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario")
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nome;

	@Column(unique = true)
	@Email
	private String email;

	@Column(length = 300)
	private String bio;

	@Column(unique = true)
	private String matricula;

	private String celular;
	private String senha;
	private TiposUsuario tipoUsuario;
	private String fotoPerfil;
	private String fotoBanner;

	private String emailContato;
	private String pronomes;
	private String materia;
	private String curso;
	
	@JsonManagedReference
	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Like> likes = new ArrayList<>();

	@JsonManagedReference
	@OneToMany(mappedBy = "usuario", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
	private List<Publicacao> publicacoes = new ArrayList<>(); 
	
	@JsonManagedReference
	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Comentario> comentarios = new ArrayList<>();

	public void adicionarPublicacao(Publicacao publicacao) {
		publicacoes.add(publicacao);
		publicacao.setUsuario(this); 
	}

	public void removerPublicacao(Publicacao publicacao) {
		publicacoes.remove(publicacao);
		publicacao.setUsuario(null); 
	}

	public void atualizarDados(@Valid DadosAtualizacaoUsuario dados) {
		if (dados.bio() != null) {
			this.bio = dados.bio();
		}
		if (dados.celular() != null) {
			this.celular = dados.celular();
		}
		if (dados.fotoPerfil() != null) {
			this.fotoPerfil = dados.fotoPerfil();
		}
		if (dados.nome() != null) {
			this.nome = dados.nome();
		}
		if (dados.senha() != null) {
			this.senha = dados.senha();
		}
		if (dados.emailContato() != null) {
			this.emailContato = dados.emailContato();
		}
		if (dados.materiaPreferida() != null) {
			this.materia = dados.materiaPreferida();
		}
		if (dados.pronomes() != null) {
			this.pronomes = dados.pronomes();
		}
		if (dados.curso() != null) {
			this.curso = dados.curso();
		}
	}

	public String getEmailContato() {
		return emailContato;
	}

	public void setEmailContato(String emailContato) {
		this.emailContato = emailContato;
	}

	public String getPronomes() {
		return pronomes;
	}

	public void setPronomes(String pronomes) {
		this.pronomes = pronomes;
	}

	public String getMateria() {
		return materia;
	}

	public void setMateria(String materia) {
		this.materia = materia;
	}

	public String getCurso() {
		return curso;
	}

	public void setCurso(String curso) {
		this.curso = curso;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getMatricula() {
		return matricula;
	}

	public void setMatricula(String matricula) {
		this.matricula = matricula;
	}

	public String getCelular() {
		return celular;
	}

	public void setCelular(String celular) {
		this.celular = celular;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public TiposUsuario getTipoUsuario() {
		return tipoUsuario;
	}

	public void setTipoUsuario(TiposUsuario tipoUsuario) {
		this.tipoUsuario = tipoUsuario;
	}

	public String getFotoPerfil() {
		return fotoPerfil;
	}

	public void setFotoPerfil(String fotoPerfil) {
		this.fotoPerfil = fotoPerfil;
	}

	public String getFotoBanner() {
		return fotoBanner;
	}

	public void setFotoBanner(String fotoBanner) {
		this.fotoBanner = fotoBanner;
	}

	public List<Publicacao> getPublicacoes() {
		return publicacoes;
	}

	public void setPublicacoes(List<Publicacao> publicacoes) {
		this.publicacoes = publicacoes;
	}

	public Long getId() {
		return id;
	}

	public List<Like> getLikes() {
		return likes;
	}

	public void setLikes(List<Like> likes) {
		this.likes = likes;
	}

}
