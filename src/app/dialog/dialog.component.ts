import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  statusList: string[] = ['BrandNew', 'Second Hand', 'Refurbished'];
  productForm!:FormGroup;
  actionBtn:string="save";


  constructor(private formBuilder:FormBuilder,private api:ApiService,private dialogref:MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData:any) { }
 
  ngOnInit(): void {
    this.productForm=this.formBuilder.group({
       productName:['',Validators.required],
       category:['',Validators.required],
       status:['',Validators.required],
       date:['',Validators.required],
       price:['',Validators.required],
       comment:['',Validators.required]
    });

    if(this.editData){
          this.actionBtn="update";
          this.productForm.controls['productName'].setValue(this.editData.productName);
          this.productForm.controls['category'].setValue(this.editData.category);
          this.productForm.controls['price'].setValue(this.editData.price);
          this.productForm.controls['date'].setValue(this.editData.date);
          this.productForm.controls['status'].setValue(this.editData.status);
          this.productForm.controls['comment'].setValue(this.editData.comment);

    }
  }
  addProduct(){
     if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            alert("product added succesfully");
            this.productForm.reset();
            this.dialogref.close('save');
           },
           error:()=>{
             alert("error while adding the product")
            }
         });
      }
     }
     else{
       this.updateProduct();
     }
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("product updated succesfully");
        this.productForm.reset();
        this.dialogref.close('update');
       },
       error:()=>{
         alert("error while updating the product");
        }
     });
  }
}
