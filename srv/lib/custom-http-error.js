import { BaseError } from 'make-error';

export default class CustomHttpError extends BaseError {
	constructor(status, msg) {
		super(msg);
		this.status = status;
	}
}
