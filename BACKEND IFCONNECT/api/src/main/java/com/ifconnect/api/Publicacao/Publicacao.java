package com.ifconnect.api.Publicacao;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ifconnect.api.Comentario.Comentario;
import com.ifconnect.api.Like.Like;
import com.ifconnect.api.Tag.Tag;
import com.ifconnect.api.Usuario.Usuario;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "publicacao")
public class Publicacao {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String texto;

	@ElementCollection
	@CollectionTable(name = "publicacao_fotos", joinColumns = @JoinColumn(name = "publicacao_id"))
	@Column(name = "foto_nome")
	private List<String> fotoNomes = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "publicacao_videos", joinColumns = @JoinColumn(name = "publicacao_id"))
	@Column(name = "video_nome")
	private List<String> videoNomes = new ArrayList<>();
	private String docNome;

	@CreationTimestamp
	private LocalDateTime dataCriacao;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "id_usuario")
	private Usuario usuario;

	@ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinTable(name = "tags_publicacoes", joinColumns = @JoinColumn(name = "publicacao_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "tag_id", referencedColumnName = "id"))
	@JsonManagedReference
	private List<Tag> tags = new ArrayList<>();

	@JsonManagedReference
	@OneToMany(mappedBy = "publicacao", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Like> likes = new ArrayList<>();

	@JsonManagedReference
	@OneToMany(mappedBy = "publicacao", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Comentario> comentarios = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTexto() {
		return texto;
	}

	public void setTexto(String texto) {
		this.texto = texto;
	}

	public List<String> getFotoNomes() {
		return fotoNomes;
	}

	public void setFotoNomes(List<String> fotoNomes) {
		this.fotoNomes = fotoNomes;
	}

	public List<String> getVideoNomes() {
		return videoNomes;
	}

	public void setVideoNomes(List<String> videoNomes) {
		this.videoNomes = videoNomes;
	}

	public String getDocNome() {
		return docNome;
	}

	public void setDocNome(String docNome) {
		this.docNome = docNome;
	}

	public LocalDateTime getDataCriacao() {
		return dataCriacao;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	public List<Like> getLikes() {
		return likes;
	}

	public void setLikes(List<Like> likes) {
		this.likes = likes;
	}

}
