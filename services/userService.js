import { userRepository } from "../repositories/userRepository.js";
import {authService} from "./authService.js";
import crypto from "node:crypto";

class UserService {
  // TODO: Implement methods to work with user

  getAll() {
    return userRepository.getAll();
  }

  getOne(search) {
    return userRepository.getOne(search);
  }

  create(user) {
    const userData = this.#createDeepCopyJson(user)

    if (this.#userExists(userData)) {
      throw new Error("User already exists");
    }

    const { hash, salt } = this.#hashPassword(user?.password);
    userData.password = `${salt}:${hash}`;

    const createdUser = userRepository.create(userData);

    return this.#sanitizeUser(createdUser);
  }

  update(id, dataToUpdate) {

    if (!id || typeof id !== 'string') {
      throw new Error('Invalid user ID');
    }

    if (!dataToUpdate || typeof dataToUpdate !== 'object') {
      throw new Error('Invalid update data');
    }

    if (this.#userExists(dataToUpdate)) {
      throw new Error("User already exists");
    }

    const updateData = this.#createDeepCopyJson(dataToUpdate)

    const pass = dataToUpdate?.password;

    if(pass){
      const { hash, salt } = this.#hashPassword(pass);
      updateData.password = `${salt}:${hash}`;
    }

    const updatedUser = userRepository.update(id, updateData)

    return this.#sanitizeUser(updatedUser);
  }

  delete(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid user ID');
    }

    return userRepository.delete(id);
  }

  search(search) {
      if (!search?.email || !search?.password) {
        throw Error("Email and password is required");
      }

      const user = this.#createDeepCopyJson(search);
      const item = userRepository.getOne({email: user.email});

      if (!item) {
        return null;
      }

      if (!this.#verifyPassword(item?.password, user?.password)) {
        throw new Error("Bad password");
      }

      return this.#sanitizeUser(item);
  }

  #hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
        .toString('hex');
    return { hash, salt };
  }

  #userExists(data) {
    const { email, phone } = data;

    return this.getOne({ email }) || this.getOne({ phone });
  }

  #sanitizeUser(user) {
    const sanitized = this.#createDeepCopyJson(user);
    delete sanitized.password;
    return sanitized;
  }

  #verifyPassword(savedHash, inputPassword) {
    if (typeof savedHash !== 'string' || typeof inputPassword !== 'string') {
      return false;
    }

    const [salt, originalHash] = savedHash.split(':');
    const inputHash = crypto
        .pbkdf2Sync(inputPassword, salt, 1000, 64, 'sha256')
        .toString('hex');
    return inputHash === originalHash;
  }

  #createDeepCopyJson(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}

const userService = new UserService();

export { userService };
