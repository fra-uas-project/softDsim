from random import random


def prob(p):
    return 1 if random() < p else 0

if __name__ == "__main__":
    print(prob(0.5))