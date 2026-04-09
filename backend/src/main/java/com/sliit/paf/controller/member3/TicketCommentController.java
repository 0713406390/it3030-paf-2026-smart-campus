package com.sliit.paf.controller.member3;

import com.sliit.paf.dto.member3.CommentRequest;
import com.sliit.paf.dto.member3.CommentUpdateRequest;
import com.sliit.paf.dto.member3.TicketCommentResponse;
import com.sliit.paf.model.member3.TicketComment;
import com.sliit.paf.model.member3.User;
import com.sliit.paf.repository.member3.UserRepository;
import com.sliit.paf.service.member3.TicketCommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketCommentController {
	private final TicketCommentService ticketCommentService;
	private final UserRepository userRepository;

	public TicketCommentController(TicketCommentService ticketCommentService, UserRepository userRepository) {
		this.ticketCommentService = ticketCommentService;
		this.userRepository = userRepository;
	}

	@GetMapping("/{ticketId}/comments")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('TECHNICIAN')")
	public ResponseEntity<List<TicketCommentResponse>> getComments(@PathVariable Long ticketId) {
		List<TicketCommentResponse> comments = ticketCommentService.getCommentsForTicket(ticketId)
				.stream()
				.map(this::mapToResponse)
				.toList();
		return ResponseEntity.ok(comments);
	}

	@PostMapping("/{ticketId}/comments")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('TECHNICIAN')")
	public ResponseEntity<TicketCommentResponse> addComment(@PathVariable Long ticketId,
															@Valid @RequestBody CommentRequest request,
															@AuthenticationPrincipal UserDetails currentUser) {
		Long userId = getUserIdFromCurrentUser(currentUser);
		boolean isAdmin = isAdmin(currentUser);
		TicketComment comment = ticketCommentService.addComment(ticketId, request, userId, isAdmin);
		return new ResponseEntity<>(mapToResponse(comment), HttpStatus.CREATED);
	}

	@PutMapping("/comments/{commentId}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('TECHNICIAN')")
	public ResponseEntity<TicketCommentResponse> updateComment(@PathVariable Long commentId,
															   @Valid @RequestBody CommentUpdateRequest request,
															   @AuthenticationPrincipal UserDetails currentUser) {
		Long userId = getUserIdFromCurrentUser(currentUser);
		boolean isAdmin = isAdmin(currentUser);
		TicketComment comment = ticketCommentService.updateComment(commentId, request, userId, isAdmin);
		return ResponseEntity.ok(mapToResponse(comment));
	}

	@DeleteMapping("/comments/{commentId}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('TECHNICIAN')")
	public ResponseEntity<Void> deleteComment(@PathVariable Long commentId,
											  @AuthenticationPrincipal UserDetails currentUser) {
		Long userId = getUserIdFromCurrentUser(currentUser);
		boolean isAdmin = isAdmin(currentUser);
		ticketCommentService.deleteComment(commentId, userId, isAdmin);
		return ResponseEntity.noContent().build();
	}

	private TicketCommentResponse mapToResponse(TicketComment comment) {
		TicketCommentResponse response = new TicketCommentResponse();
		response.setId(comment.getId());
		response.setContent(comment.getContent());
		response.setCreatedAt(comment.getCreatedAt());
		response.setUpdatedAt(comment.getUpdatedAt());
		response.setIsInternal(comment.getIsInternal());

		TicketCommentResponse.Author author = new TicketCommentResponse.Author();
		author.setId(comment.getCommentedBy().getId());
		author.setName(comment.getCommentedBy().getName());
		response.setAuthor(author);
		return response;
	}

	private boolean isAdmin(UserDetails currentUser) {
		return currentUser != null && currentUser.getAuthorities().stream()
				.anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
	}

	private Long getUserIdFromCurrentUser(UserDetails currentUser) {
		String username = (currentUser != null && currentUser.getUsername() != null && !currentUser.getUsername().isBlank())
				? currentUser.getUsername()
				: "system-user";

		return userRepository.findByUsername(username)
				.map(User::getId)
				.orElseGet(() -> {
					User user = new User();
					user.setUsername(username);
					user.setName(username);
					return userRepository.save(user).getId();
				});
	}
}
