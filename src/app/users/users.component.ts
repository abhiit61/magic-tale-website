import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  errorMessage = '';
  selectedUser: User | null = null;
  actionInProgress: string | null = null;

  private readonly currentUserEmail: string | null;

  constructor(
    private readonly usersService: UsersService,
    authService: AuthService
  ) {
    this.currentUserEmail = authService.getCurrentUserEmail();
  }

  isSelf(user: User): boolean {
    return !!this.currentUserEmail && this.currentUserEmail === user.email;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.usersService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    });
  }

  openDetails(user: User): void {
    this.selectedUser = user;
  }

  closeDetails(): void {
    this.selectedUser = null;
  }

  deactivateUser(user: User): void {
    if (this.actionInProgress) return;
    this.actionInProgress = `deactivate-${user.id}`;
    this.usersService.deactivateUser(user.id).subscribe({
      next: updated => {
        const idx = this.users.findIndex(u => u.id === user.id);
        if (idx !== -1) this.users[idx] = updated;
        if (this.selectedUser?.id === user.id) this.selectedUser = updated;
        this.actionInProgress = null;
      },
      error: () => {
        this.actionInProgress = null;
      }
    });
  }

  promoteToAdmin(user: User): void {
    if (this.actionInProgress) return;
    this.actionInProgress = `promote-${user.id}`;
    this.usersService.updateUserRole(user.id, 'ADMIN').subscribe({
      next: updated => {
        const idx = this.users.findIndex(u => u.id === user.id);
        if (idx !== -1) this.users[idx] = updated;
        if (this.selectedUser?.id === user.id) this.selectedUser = updated;
        this.actionInProgress = null;
      },
      error: () => {
        this.actionInProgress = null;
      }
    });
  }

  isActing(key: string): boolean {
    return this.actionInProgress === key;
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }
}
