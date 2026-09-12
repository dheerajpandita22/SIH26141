import { AttackType, AttackInjection } from '../types/simulation';
import { normalizeAngle } from './quantumState';

/**
 * Simulate different attack scenarios
 */
export class AttackSimulator {
  private sessionNonce: string = '';
  private previousSessionNonce: string = '';

  public initializeSession(): string {
    this.sessionNonce = generateNonce();
    return this.sessionNonce;
  }

  public simulateAttack(
    attackType: AttackType,
    legitimateTheta: number,
    channelDisturbanceProb: number = 0.3
  ): AttackInjection {
    const injection: AttackInjection = {
      type: attackType,
    };

    switch (attackType) {
      case 'none':
        // No attack
        break;

      case 'forgery':
        // Attacker guesses an incorrect θ
        const attackerTheta = legitimateTheta + (Math.random() * Math.PI - Math.PI / 2);
        injection.attackerTheta = normalizeAngle(attackerTheta);
        injection.attackerThetaDiff = Math.abs(
          normalizeAngle(injection.attackerTheta - legitimateTheta)
        );
        break;

      case 'impersonation':
        // Attacker sends a generic |+> state (superposition)
        // This is mathematically represented as θ = π/2 (equal superposition)
        injection.attackerTheta = Math.PI / 2;
        injection.attackerThetaDiff = Math.abs(
          normalizeAngle(injection.attackerTheta - legitimateTheta)
        );
        break;

      case 'replay':
        // Replay detection requires session/nonce validation
        injection.nonceValid = this.sessionNonce !== this.previousSessionNonce;
        break;

      case 'channel_manipulation':
        // Simulate bit-flip disturbance with given probability
        const threshold = channelDisturbanceProb / 100;
        injection.channelDisturbanceProb = channelDisturbanceProb;
        injection.channelDisturbanceOccurred = Math.random() < threshold;
        break;
    }

    return injection;
  }

  public applyAttackToTheta(
    theta: number,
    attack: AttackInjection
  ): number {
    if (attack.type === 'forgery' || attack.type === 'impersonation') {
      return attack.attackerTheta ?? theta;
    }
    return theta;
  }

  public recordPreviousSession(): void {
    this.previousSessionNonce = this.sessionNonce;
  }

  public getCurrentNonce(): string {
    return this.sessionNonce;
  }

  public getPreviousNonce(): string {
    return this.previousSessionNonce;
  }
}

/**
 * Generate a random nonce for session validation
 */
function generateNonce(): string {
  return `nonce_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export const attackSimulator = new AttackSimulator();
