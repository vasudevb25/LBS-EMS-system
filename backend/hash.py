import hashlib

def hash_string(input_string: str) -> str:
    """Returns the SHA-256 hash of the given input string."""
    sha256_hash = hashlib.sha256()
    sha256_hash.update(input_string.encode('utf-8'))
    return sha256_hash.hexdigest()
print(hash_string("vasu"))