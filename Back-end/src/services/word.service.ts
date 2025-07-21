import { Injectable } from '@nestjs/common';

Injectable();
export class WordService {
  private words: string[] = [];

  addWord(word: string): string {
    this.words.push(word);
    return `Word "${word}" added successfully!`;
  }

  getWords(): string[] {
    return this.words;
  }
}
// connect to the database or any other service if needed