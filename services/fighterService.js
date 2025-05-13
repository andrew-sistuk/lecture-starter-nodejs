import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  // TODO: Implement methods to work with fighters
    getAll() {
        return fighterRepository.getAll();
    }

    getById(id) {
        return fighterRepository.getOne({ id });
    }

    createFighter(data) {
        return fighterRepository.create(data);
    }

    updateFighter(id, updateData) {
        const existing = this.getById(id);
        if (!existing) return null;
        return fighterRepository.update(id, updateData);
    }

    deleteFighter(id) {
        return fighterRepository.delete(id);
    }
}

const fighterService = new FighterService();

export { fighterService };
