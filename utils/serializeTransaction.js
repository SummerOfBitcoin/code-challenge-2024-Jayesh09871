function serializeTransaction(transaction) {
    let buffer = Buffer.alloc(0);

    // Version
    buffer = Buffer.concat([buffer, Buffer.from(transaction.version.toString(16).padStart(8, '0'), 'hex').reverse()]);

    // Input Count
    buffer = Buffer.concat([buffer, encodeVarInt(transaction.vin.length)]);

    // Inputs (vin)
    for (let input of transaction.vin) {
        // Transaction ID (TxID)
        buffer = Buffer.concat([buffer, Buffer.from((input.txid), "hex").reverse()]);

        // Vout Index
        buffer = Buffer.concat([buffer, Buffer.from(input.vout.toString(16).padStart(8, '0'), 'hex').reverse()]);

        // Script Length
        buffer = Buffer.concat([buffer, encodeVarInt(input.scriptsig.length / 2)]);

        // Unlocking Script
        buffer = Buffer.concat([buffer, Buffer.from(input.scriptsig, 'hex')]);


        // Sequence
        buffer = Buffer.concat([buffer, Buffer.from(input.sequence.toString(16).padStart(8, '0'), 'hex').reverse()]);
    }

    // Output Count
    buffer = Buffer.concat([buffer, encodeVarInt(transaction.vout.length)]);

    // Outputs (vout)
    for (let output of transaction.vout) {
        // Value
        buffer = Buffer.concat([buffer, Buffer.from(output.value.toString(16).padStart(16, '0'), 'hex').reverse()]);

        // Script Length
        buffer = Buffer.concat([buffer, encodeVarInt(output.scriptpubkey.length / 2)]);

        // Locking Script
        buffer = Buffer.concat([buffer, Buffer.from(output.scriptpubkey, 'hex')]);
    }

    // Locktime
    buffer = Buffer.concat([buffer, Buffer.from(transaction.locktime.toString(16).padStart(8, '0'), 'hex').reverse()]);
        
    return Buffer.from(buffer).toString("hex");
}

function encodeVarInt(value) {
    if (value < 0xfd) {
        return Buffer.from([value]);
    } else if (value <= 0xffff) {
        return Buffer.concat([Buffer.from([0xfd]), Buffer.from(value.toString(16).padStart(4, '0'), 'hex').reverse()]);
    } else if (value <= 0xffffffff) {
        return Buffer.concat([Buffer.from([0xfe]), Buffer.from(value.toString(16).padStart(8, '0'), 'hex').reverse()]);
    } else {
        return Buffer.concat([Buffer.from([0xff]), Buffer.from(value.toString(16).padStart(16, '0'), 'hex').reverse()]);
    }
}

module.exports = {
    serializeTransaction,
}