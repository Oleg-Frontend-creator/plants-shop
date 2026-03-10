import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[passwordRepeat]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordRepeatDirective, multi: true}]
})
export class PasswordRepeatDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordRepeat = control.get('passwordRepeat');

    if (password?.value !== passwordRepeat?.value) {
      passwordRepeat?.setErrors({...passwordRepeat.errors, passwordRepeat: true});
      return {passwordRepeat: true};
    }

    if (passwordRepeat?.errors) {
      const errors = {...passwordRepeat.errors};
      delete errors['passwordRepeat'];
      passwordRepeat.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }
}
