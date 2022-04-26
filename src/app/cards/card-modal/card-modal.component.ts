import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card } from 'src/app/models/card';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss']
})
export class CardModalComponent implements OnInit {

  cardForm!: FormGroup;
  showSpinner: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CardModalComponent>,
    private fb: FormBuilder,
    private cardService: CardService,
    private _snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: Card
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.cardForm = this.fb.group({
      name: [this.data?.name || '', Validators.maxLength(50)],
      title: [this.data?.title || '', [Validators.required, Validators.maxLength(255)]],
      phone: [this.data?.phone || '', [Validators.required, Validators.maxLength(20)]],
      email: [this.data?.email || '', [Validators.email, Validators.maxLength(50)]],
      address: [this.data?.adress || '',Validators.maxLength(255)],
      });
  }

  addCard(): void {
    this.showSpinner = true;
    this.cardService.addCard(this.cardForm.value)
    .subscribe((res:any)=>{
      this.getSuccess(res || 'Kartvizit basariyla eklendi.');
    }, (err:any) => {
      this.getError(err.message || 'Kartvizit eklenirken bir sorun olustu');
    
    });
  }

  updateCard(): void{
    this.showSpinner = true;
    this.cardService.updateCard(this.cardForm.value, this.data.id)
    .subscribe((res:any) => {
      this.getSuccess(res || 'Kartvizit basariyla guncellendi.');
    }, (err:any) => {
      this.getError(err.message || 'Kartvizit guncellenirken bir sorun olustu');
    });
  }

  deleteCard(): void {
    this.showSpinner = true;
    this.cardService.deleteCard(this.data.id)
    .subscribe((res:any) => {
      this.getSuccess(res || 'Kartvizit basariyla silindi.');
    }, (err:any) => {
      this.getError(err.message || 'Kartvizit silinirken bir sorun olustu');
    
    });
  }

  getSuccess(message: string): void {
    this.snackbarService.createSnackBar('success', message);
    this.cardService.getCards();
    this.showSpinner = false;
    this.dialogRef.close();
  }

  getError(message:string): void {
    this.snackbarService.createSnackBar('error',message);
    this.showSpinner = false;
  }
}
