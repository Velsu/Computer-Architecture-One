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

      //RET
      case RET:
        this.PC = this.ram.read(this.reg[SP]);
        this.reg[SP]++;
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
    if (IR !== CALL && IR !== RET) {
      this.PC += 1 + (IR >> 6);
    }
  }
}

module.exports = CPU;

// const instructions = {
//   168: "ADD",
//   121: "DEC",
//   171: "DIV",
//   1: "HLT",
//   120: "INC",
//   153: "LDI",
//   170: "MUL",
//   76: "POP",
//   67: "PRN",
//   77: "PUSH"
// };

// // const ADD = 168;
// // const DIV = 171;
// // const INC = 120;
// // const DEC = 121;

// // Indices of registers reserved by the cpu

// const SP = 7;

// /**
//  * Class for simulating a simple Computer (CPU & memory)
//  */
// class CPU {
//   /**
//    * Initialize the CPU
//    */
//   constructor(ram) {
//     this.ram = ram;

//     this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

//     // Special-purpose registers
//     this.PC = 0; // Program Counter
//     this.reg[SP] = 0xf4; // Initialize stack pointer
//   }

//   /**
//    * Store value in memory address, useful for program loading
//    */
//   poke(address, value) {
//     this.ram.write(address, value);
//   }

//   /**
//    * Starts the clock ticking on the CPU
//    */
//   startClock() {
//     this.clock = setInterval(() => {
//       this.tick();
//     }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
//   }

//   /**
//    * Stops the clock
//    */
//   stopClock() {
//     clearInterval(this.clock);
//   }

//   hlt() {
//     this.stopClock();
//   }

//   /**
//    * ALU functionality
//    *
//    * The ALU is responsible for math and comparisons.
//    *
//    * If you have an instruction that does math, i.e. MUL, the CPU would hand
//    * it off to it's internal ALU component to do the actual work.
//    *
//    * op can be: ADD SUB MUL DIV INC DEC CMP
//    */
//   alu(op, regA, regB) {
//     switch (op) {
//       case "MUL":
//         // !!! IMPLEMENT ME
//         // return this.ram.read(regA) * this.ram.read(regB);
//         return (this.reg[regA] = this.reg[regA] * this.reg[regB]);
//         break;
//       case "ADD":
//         // return this.ram.read(regA) + this.ram.read(regB);
//         return (this.reg[regA] = this.reg[regA] + this.reg[regB]);
//         break;
//       case "DIV":
//         if (this.reg[regB] === 0) {
//           console.log("No 0 divide");
//           process.exit(1);
//         }
//         // return this.ram.read(regA) / this.ram.read(regB);
//         return (this.reg[regA] = this.reg[regA] / this.reg[regB]);
//         break;
//       case "INC":
//         return (this.reg[regA] = this.reg[regA] + 1);
//         break;
//       case "DEC":
//         return (this.reg[regA] = this.reg[regA] - 1);
//         break;
//     }
//   }

//   /**
//    * Advances the CPU one cycle
//    */
//   tick() {
//     // Load the instruction register (IR--can just be a local variable here)
//     // from the memory address pointed to by the PC. (I.e. the PC holds the
//     // index into memory of the instruction that's about to be executed
//     // right now.)

//     const IR = this.ram.read(this.PC);

//     // Debugging output
//     // console.log(`${this.PC}: ${IR.toString(2)}`);

//     // Get the two bytes in memory _after_ the PC in case the instruction
//     // needs them.

//     const operandA = this.ram.read(this.PC + 1);
//     const operandB = this.ram.read(this.PC + 2);

//     // Execute the instruction. Perform the actions for the instruction as
//     // outlined in the LS-8 spec.

//     const instruction = instructions[IR];
//     this[instruction](operandA, operandB);

//     // Increment the PC register to go to the next instruction. Instructions
//     // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
//     // instruction byte tells you how many bytes follow the instruction byte
//     // for any particular instruction.

//     // Implement the PC unless the instruction was CALL or JMP
//     // Increment PC by 1 + the value of the two leftmost bits of the instruction
//     this.PC += (IR >> 6) + 1;
//     // console.log(`new PC: ${this.PC}`)
//   }

//   //
//   // I/O functions
//   //

//   // Store immediate value into register
//   LDI(register, immediate) {
//     // console.log(`LDI ${register} ${immediate}`)
//     this.reg[register] = immediate;
//   }

//   // Print number value from register
//   PRN(register) {
//     console.log(this.reg[register]);
//   }

//   //
//   // Math functions
//   //

//   ADD(reg1, reg2) {
//     this.reg[reg1] = this.alu("ADD", reg1, reg2);
//   }

//   MUL(reg1, reg2) {
//     this.reg[reg1] = this.alu("MUL", reg1, reg2);
//   }

//   //
//   // Control flow functions
//   //

//   // Stop the system
//   HLT() {
//     console.log("registers: ", this.reg);
//     this.hlt();
//   }

//   // Copy value in register to a new address in stack memory
//   PUSH(register) {
//     this.reg[SP]--;
//     this.ram.write(this.reg[SP], this.reg[register]);
//   }

//   // Copy the latest value in stack memory to provided register
//   POP(register) {
//     const value = this.ram.read(this.reg[SP]);
//     this.reg[SP]++;
//     this.reg[register] = value;
//   }
// }

// module.exports = CPU;
