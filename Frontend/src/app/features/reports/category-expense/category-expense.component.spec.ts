import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryExpenseComponent } from './category-expense.component';

describe('CategoryExpenseComponent', () => {
  let component: CategoryExpenseComponent;
  let fixture: ComponentFixture<CategoryExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryExpenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
