import { Party } from "./Party";
import { Client } from "./SocketManager";

export class PartyManager {
  private parties: Party[];

  constructor() {
    this.parties = [];
  }

  createParty(host: Client) {
    const party = new Party(host);
    this.parties.push(party);
  }

  deleteParty(id: string) {
    this.parties = this.parties.filter((party) => party.id !== id);
  }
}
