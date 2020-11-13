// import { assertEquals, assertThrows, assertThrowsAsync } from "./deps.ts";
// import {
//   arg,
//   command,
//   InvalidChoiceError,
//   MultipleArgNotLastError,
//   RequiredArgAfterOptionalValidationError,
//   RequiredArgsError,
//   UnexpectedArgsError,
// } from "../mod.ts";

// Deno.test("single arg", async () => {
//   const cmd = command({
//     args: [arg.required("str")] as const,
//     run(args): string {
//       return args[0];
//     },
//   });
//   const result = await cmd.run(["123"]);
//   assertEquals(result, "123");
// });

// Deno.test("single number arg", async () => {
//   const cmd = command({
//     args: [arg.required("num", { parse: (i: string) => parseInt(i) })] as const,
//     run(args): number {
//       return args[0];
//     },
//   });
//   const result = await cmd.run(["123"]);
//   assertEquals(result, 123);
// });

// Deno.test("two args", async () => {
//   const cmd = command({
//     args: [arg.required("a"), arg.required("b")] as const,
//     run(args): [string, string] {
//       return [args[0], args[1]];
//     },
//   });
//   const result = await cmd.run(["123", "abc"]);
//   assertEquals(result, ["123", "abc"]);
// });

// Deno.test("two optional args", async () => {
//   const cmd = command({
//     args: [arg.optional("a"), arg.optional("b")] as const,
//     run(args): [string | undefined, string | undefined] {
//       return [args[0], args[1]];
//     },
//   });
//   const result = await cmd.run(["123", "abc"]);
//   assertEquals(result, ["123", "abc"]);
// });

// Deno.test("ignores missing optional arg", async () => {
//   const cmd = command({
//     args: [arg.optional("a"), arg.optional("b")] as const,
//     run(args) {
//       return [args[0], args[1]];
//     },
//   });
//   const result = await cmd.run(["123"]);
//   assertEquals(result, ["123", undefined]);
// });

// Deno.test("single multiple arg", async () => {
//   const cmd = command({
//     args: [arg.multiple("m")] as const,
//     run(args): string[] {
//       return args[0];
//     },
//   });
//   const result = await cmd.run(["123"]);
//   assertEquals(result, ["123"]);
// });

// Deno.test("2 arg multiples", async () => {
//   const cmd = command({
//     args: [arg.multiple("m")] as const,
//     run(args) {
//       return args;
//     },
//   });
//   const result = await cmd.run(["1", "2"]);
//   assertEquals(result, [["1", "2"]]);
// });

// Deno.test("parses multiple args after required", async () => {
//   const cmd = command({
//     args: [arg.required("a"), arg.multiple("m")] as const,
//     run(args): [string, string[]] {
//       return [args[0], args[1]];
//     },
//   });
//   const result = await cmd.run(["1", "2", "3"]);
//   assertEquals(result, ["1", ["2", "3"]]);
// });

// Deno.test("default as function", async () => {
//   const cmd = command({
//     args: [arg.required("a", { default: () => "abc" })] as const,
//     run(args) {
//       return args;
//     },
//   });
//   const result = await cmd.run([]);
//   assertEquals(result, ["abc"]);
// });

// Deno.test("default as async function", async () => {
//   const cmd = command({
//     args: [arg.required("a", { default: async () => "abc" })] as const,
//     run(args) {
//       return args;
//     },
//   });
//   const result = await cmd.run([]);
//   assertEquals(result, ["abc"]);
// });

// Deno.test("default as value", async () => {
//   const cmd = command({
//     args: [arg.required("a", { default: "abc" })] as const,
//     run(args) {
//       return args;
//     },
//   });
//   const result = await cmd.run([]);
//   assertEquals(result, ["abc"]);
// });

// Deno.test("custom parser", async () => {
//   const cmd = command({
//     args: [
//       arg.optional("a", { parse: (i: string) => i.toUpperCase() }),
//     ] as const,
//     run(args) {
//       return args;
//     },
//   });
//   const result = await cmd.run(["abc"]);
//   assertEquals(result, ["ABC"]);
// });

// Deno.test("custom async parser", async () => {
//   const cmd = command({
//     args: [
//       arg.optional("a", { parse: async (i: string) => i.toUpperCase() }),
//     ] as const,
//     run(args) {
//       return args;
//     },
//   });
//   const result = await cmd.run(["abc"]);
//   assertEquals(result, ["ABC"]);
// });

// Deno.test("custom parser for multi", async () => {
//   const cmd = command({
//     args: [
//       arg.multiple("m", { parse: (i: string) => i.toUpperCase() }),
//     ] as const,
//     run(args) {
//       return args;
//     },
//   });
//   const result = await cmd.run(["abc", "def", "ghi"]);
//   assertEquals(result, [["ABC", "DEF", "GHI"]]);
// });

// Deno.test("custom async parser for multi", async () => {
//   const cmd = command({
//     args: [
//       arg.multiple("m", { parse: async (i: string) => i.toUpperCase() }),
//     ] as const,
//     run(args) {
//       return args;
//     },
//   });
//   const result = await cmd.run(["abc", "def", "ghi"]);
//   assertEquals(result, [["ABC", "DEF", "GHI"]]);
// });

// Deno.test("choices selection", async () => {
//   const cmd = command({
//     args: [arg.required("a", { choices: ["1"] })] as const,
//     run(args) {
//       return args;
//     },
//   });
//   const result = await cmd.run(["1"]);
//   assertEquals(result, ["1"]);
// });

// Deno.test("choices invalid selection", async () => {
//   const cmd = command({
//     args: [arg.required("a", { choices: ["1", "10"] })] as const,
//     run(args) {
//       return args;
//     },
//   });
//   await assertThrowsAsync(
//     async () => {
//       await cmd.run(["2"]);
//     },
//     InvalidChoiceError,
//     'Expected "2" to be one of:\n1\n10',
//   );
// });

// Deno.test("choices function invalid selection", async () => {
//   const cmd = command({
//     args: [arg.required("a", { choices: () => ["1", "10"] })] as const,
//     run(args) {
//       return args;
//     },
//   });
//   await assertThrowsAsync(
//     async () => {
//       await cmd.run(["2"]);
//     },
//     InvalidChoiceError,
//     'Expected "2" to be one of:\n1\n10',
//   );
// });

// Deno.test("choices async invalid selection", async () => {
//   const cmd = command({
//     args: [arg.required("a", { choices: async () => ["1", "10"] })] as const,
//     run(args) {
//       return args;
//     },
//   });
//   await assertThrowsAsync(
//     async () => {
//       await cmd.run(["2"]);
//     },
//     InvalidChoiceError,
//     'Expected "2" to be one of:\n1\n10',
//   );
// });

// Deno.test("invalid: required after optional", async () => {
//   assertThrows(
//     () => {
//       command({
//         args: [arg.optional("num"), arg.required("str")] as const,
//         run() {},
//       });
//     },
//     RequiredArgAfterOptionalValidationError,
//     'Optional argument "NUM" is followed by required argument "STR"',
//   );
// });

// Deno.test("invalid: optional after multiple", async () => {
//   assertThrows(
//     () => {
//       command({
//         args: [arg.multiple("num"), arg.optional("str")] as const,
//         run() {},
//       });
//     },
//     MultipleArgNotLastError,
//     'Multiple argument "NUM" must be the last argument defined.',
//   );
// });

// Deno.test("missing required arg", async () => {
//   const cmd = command({
//     args: [arg.required("num"), arg.required("str")] as const,
//     run() {},
//   });
//   await assertThrowsAsync(
//     async () => {
//       await cmd.run(["123"]);
//     },
//     RequiredArgsError,
//     `Missing 1 required arg:
// STR`,
//   );
// });

// Deno.test("unexpected arg", async () => {
//   const cmd = command({
//     args: [arg.required("num")] as const,
//     run() {},
//   });
//   await assertThrowsAsync(
//     async () => {
//       await cmd.run(["123", "bar"]);
//     },
//     UnexpectedArgsError,
//     `Unexpected argument: bar`,
//   );
// });
