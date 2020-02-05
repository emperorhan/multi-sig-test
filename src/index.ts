import { Api, JsonRpc, Serialize, RpcInterfaces, ApiInterfaces } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import { TextDecoder, TextEncoder } from "text-encoding";
import "cross-fetch/polyfill";
import ecc from "eosjs-ecc";

class EOS {
    public api: Api;
    public rpc: JsonRpc;

    constructor() {
        const signatureProvider: JsSignatureProvider = new JsSignatureProvider([
            // 크리에이터
            // "5J75StcmxPNRBdjEH6nLt7McTrWz1ruq9ZLLeEh39jQcS9YXthx"
            // 원작자
            // "5Km1S4B4jFiUv81NBinPNMsFJjRn1MumCsdwjoXsU96gDiPY57R"
            // 멀티 시그 제안자
            "5Jngc9nRaWvQJpGG4uTH2n3c6VXFB9FF9D6hseaukRLdenanTma"
        ]);

        this.rpc = new JsonRpc(`http://54.180.100.101:80`);
        this.api = new Api({
            rpc: this.rpc,
            signatureProvider,
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder()
        });
    }
}

const eos = new EOS();

const transaction = async () => {
    const EXPIRATION_TIME = 3600;
    const BEHIND_BLOCK = 3;

    const info = await eos.rpc.get_info();

    const refBlock: RpcInterfaces.BlockTaposInfo = await eos.rpc.get_block(
        info.head_block_num - BEHIND_BLOCK
    );

    const transaction = {
        expiration: Serialize.timePointSecToDate(
            Serialize.dateToTimePointSec(refBlock.timestamp) + EXPIRATION_TIME
        ),
        ref_block_num: refBlock.block_num & 0xffff,
        ref_block_prefix: refBlock.ref_block_prefix,
        actions: [
            {
                account: "idndtestest1",
                name: "addproduct",
                authorization: [
                    {
                        actor: "idndtesttest",
                        permission: "active"
                    },
                    {
                        actor: "idndtestest2",
                        permission: "active"
                    }
                ],
                data: {
                    productId: 3,
                    creator: "idndtestest2",
                    price: "1000.0000 ED",
                    remixId: 0,
                    ratio: 80
                }
            }
        ],
        signatures: []
    };
    return transaction;
};

async function Propose() {
    try {
        const serAction = await eos.api.serializeActions([
            {
                account: "idndtestest1",
                name: "addproduct",
                authorization: [
                    {
                        actor: "idndtesttest",
                        permission: "active"
                    },
                    {
                        actor: "idndtestest2",
                        permission: "active"
                    }
                ],
                data: {
                    productId: 5,
                    creator: "idndtestest2",
                    price: "9999.0000 ED",
                    remixId: 3,
                    ratio: 30
                }
            }
        ]);
        const addProduct = {
            expiration: Serialize.timePointSecToDate(
                Math.round(new Date().getTime() / 1000) + 5400
            ),
            ref_block_num: 0,
            ref_block_prefix: 0,
            max_net_usage_words: 0,
            max_cpu_usage_ms: 0,
            delay_sec: 0,
            context_free_actions: [],
            actions: serAction,
            transaction_extensions: []
        };

        const trx = await eos.api.transact(
            {
                actions: [
                    {
                        account: "led.msig",
                        name: "propose",
                        authorization: [
                            {
                                actor: "emperor.p",
                                permission: "active"
                            }
                        ],
                        data: {
                            proposer: "emperor.p",
                            proposal_name: "idnd_1234",
                            requested: [
                                {
                                    actor: "idndtesttest",
                                    permission: "active"
                                },
                                {
                                    actor: "idndtestest2",
                                    permission: "active"
                                }
                            ],
                            trx: addProduct
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 30,
                broadcast: true,
                sign: true
            }
        );

        console.log(trx);

        // console.log(JSON.stringify(serAction));
    } catch (error) {
        throw new Error(error);
    }
}
async function Approve1() {
    try {
        const trx = await eos.api.transact(
            {
                actions: [
                    {
                        account: "led.msig",
                        name: "approve",
                        authorization: [
                            {
                                actor: "idndtestest2",
                                permission: "active"
                            }
                        ],
                        data: {
                            proposer: "emperor.p",
                            proposal_name: "idnd_1234",
                            level: {
                                actor: "idndtestest2",
                                permission: "active"
                            }
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 30,
                broadcast: true,
                sign: true
            }
        );
        console.log(trx);
    } catch (error) {
        throw new Error(error);
    }
}
async function Approve2() {
    try {
        const trx = await eos.api.transact(
            {
                actions: [
                    {
                        account: "led.msig",
                        name: "approve",
                        authorization: [
                            {
                                actor: "idndtesttest",
                                permission: "active"
                            }
                        ],
                        data: {
                            proposer: "emperor.p",
                            proposal_name: "idnd_1234",
                            level: {
                                actor: "idndtesttest",
                                permission: "active"
                            }
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 30,
                broadcast: true,
                sign: true
            }
        );
        console.log(trx);
    } catch (error) {
        throw new Error(error);
    }
}
async function Excute() {
    try {
        const trx = await eos.api.transact(
            {
                actions: [
                    {
                        account: "led.msig",
                        name: "exec",
                        authorization: [
                            {
                                actor: "emperor.p",
                                permission: "active"
                            }
                        ],
                        data: {
                            proposer: "emperor.p",
                            proposal_name: "idnd_1234",
                            executer: "emperor.p"
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 30,
                broadcast: true,
                sign: true
            }
        );
        console.log(trx);
    } catch (error) {
        throw new Error(error);
    }
}
async function main() {
    try {
        const chainId = (await eos.rpc.get_info()).chain_id;

        const tr = await transaction();
        const trx = {
            ...tr,
            actions: await eos.api.serializeActions(tr.actions)
        };
        const serializedTransaction = eos.api.serializeTransaction(trx);

        const signBuf = Buffer.concat([
            Buffer.from(chainId, "hex"),
            Buffer.from(serializedTransaction),
            Buffer.from(new Uint8Array(32))
        ]);

        const sig1 = ecc.sign(
            signBuf,
            "5J75StcmxPNRBdjEH6nLt7McTrWz1ruq9ZLLeEh39jQcS9YXthx"
        );
        console.log(sig1);

        const trx2 = {
            ...trx,
            signatures: [sig1]
        };

        const serializedTransaction2 = eos.api.serializeTransaction(trx2);

        const signBuf2 = Buffer.concat([
            Buffer.from(chainId, "hex"),
            Buffer.from(serializedTransaction2),
            Buffer.from(new Uint8Array(32))
        ]);

        const sig2 = ecc.sign(
            signBuf2,
            "5Km1S4B4jFiUv81NBinPNMsFJjRn1MumCsdwjoXsU96gDiPY57R"
        );
        console.log(sig2);

        const trx3 = {
            ...trx,
            signatures: [sig1, sig2]
        };
        const serializedTransaction3 = eos.api.serializeTransaction(trx3);

        setTimeout(async () => {
            const ret = await eos.api.pushSignedTransaction({
                signatures: [sig1, sig2],
                serializedTransaction: serializedTransaction3
            });
            console.log(ret);
        }, 10000);
        // const ret = await eos.api.pushSignedTransaction({
        //     signatures: [sig1, sig2],
        //     serializedTransaction: serializedTransaction3
        // });

        // console.log(ret);
    } catch (error) {
        throw new Error(error.message);
    }
}
// main();
// Propose();
// Approve1();
// Approve2();

setTimeout(() => {
    Excute();
}, 1900);
