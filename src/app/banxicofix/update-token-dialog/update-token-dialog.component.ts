import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  token: string;
}

@Component({
  selector: 'app-update-token-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './update-token-dialog.component.html',
})
export class UpdateTokenDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UpdateTokenDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly token = signal(this.data.token);

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.token());
  }
}
