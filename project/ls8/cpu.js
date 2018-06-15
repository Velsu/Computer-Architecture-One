/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Class for simulating a simple Computer (CPU & memory)
 */

const HLT = 1;
const PRN = 67;
const LDI = 153;
const MUL = 170;
const ADD = 168;
const DIV = 171;
const INC = 120;
const DEC = 121;
const PUSH = 77;
const POP = 76;
const CALL = 72;
const RET = 9;
const CMP = 160;
const JMP = 80;
const JEQ = 81;
const JNE = 82;

const SP = 7;
class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
    this.reg[SP] = 0xf4;

    // Special-purpose registers
    this.PC = 0; // Program Counter
    this.FL = 0;
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
   *
   * The ALU is responsible for math and comparisons.
   *
   * If you have an instruction that does math, i.e. MUL, the CPU would hand
   * it off to it's internal ALU component to do the actual work.
   *
   * op can be: ADD SUB MUL DIV INC DEC CMP
   */
  alu(op, regA, regB) {
    switch (op) {
      case "MUL":
        // !!! IMPLEMENT ME
        // return this.ram.read(regA) * this.ram.read(regB);
        return (this.reg[regA] = this.reg[regA] * this.reg[regB]);
        break;
      case "ADD":
        // return this.ram.read(regA) + this.ram.read(regB);
        return (this.reg[regA] = this.reg[regA] + this.reg[regB]);
        break;
      case "DIV":
        if (this.reg[regB] === 0) {
          console.log("No 0 divide");
          process.exit(1);
        }
        // return this.ram.read(regA) / this.ram.read(regB);
        return (this.reg[regA] = this.reg[regA] / this.reg[regB]);
        break;
      case "INC":
        return (this.reg[regA] = this.reg[regA] + 1);
        break;
      case "DEC":
        return (this.reg[regA] = this.reg[regA] - 1);
        break;
      case "CMP":
        if (this.reg[regA] > this.reg[regB]) this.FL = 2;
        if (this.reg[regA] < this.reg[regB]) this.FL = 4;
        if (this.reg[regA] == this.reg[regB]) this.FL = 1;
        break;
    }
  }

  hlt() {
    this.stopClock();
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)

    // !!! IMPLEMENT ME
    const IR = this.ram.read(this.PC);

    // Debugging output
    // console.log(`${this.PC}: ${IR.toString(2)}`);

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.

    // !!! IMPLEMENT ME

    const operandA = this.ram.read(this.PC + 1);
    const operandB = this.ram.read(this.PC + 2);

    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.

    // !!! IMPLEMENT ME
    switch (IR) {
      // HLT
      case HLT:
        this.hlt();
        break;
      // LDI
      case LDI:
        this.reg[operandA] = operandB;
        break;
      // PRN
      case PRN:
        console.log(this.reg[operandA]);
        break;
      case MUL:
        this.reg[operandA] = this.alu("MUL", operandA, operandB);
        break;
      case ADD:
        this.alu("ADD", operandA, operandB);
        break;
      case DIV:
        this.alu("DIV", operandA, operandB);
        break;
      case INC:
        this.alu("INC", operandA, operandB);
        break;
      case DEC:
        this.alu("DEC", operandA, operandB);
        break;
      case PUSH:
        this.reg[SP]--;
        this.ram.write(this.reg[SP], this.reg[operandA]);
        break;
      case POP:
        this.reg[operandA] = this.ram.read(this.reg[SP]);
        this.reg[SP]++;
        break;
      case CALL:
        this.reg[SP]--;
        this.ram.write(this.reg[SP], this.PC + 2);
        this.PC = this.reg[operandA];
        break;
      case RET:
        this.PC = this.ram.read(this.reg[SP]);
        this.reg[SP]++;
        break;
      case CMP:
        this.alu("CMP", operandA, operandB);
        break;
      case JMP:
        this.PC = this.reg[operandA];
        break;
      case JEQ:
        this.FL === 1
          ? (this.PC = this.reg[operandA])
          : (this.PC += 1 + (IR >> 6));
        break;
      case JNE:
        this.FL !== 1
          ? (this.PC = this.reg[operandA])
          : (this.PC += 1 + (IR >> 6));
        break;
      default:
        console.log("something went wrong");
        break;
    }

    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.

    // !!! IMPLEMENT ME
    // !!! IMPLEMENT ME
    if (IR !== CALL && IR !== JMP && IR !== RET && IR !== JEQ && IR !== JNE) {
      this.PC += 1 + (IR >> 6);
    }
  }
}

module.exports = CPU;
