import { PubSub } from '@google-cloud/pubsub';
import { logger } from '@common/logger/Logger';

const pubSubClient = new PubSub();

export async function publishBatchedMessages(topicName: string, data: Record<string, unknown>[]) {
    const publishOptions = {
        batching: {
            maxMessages: 100,
            maxMilliseconds: 10000, // 10 seconds
        },
    };
    const batchPublisher = pubSubClient.topic(topicName, publishOptions);

    const promises = [];

    for (const item of data) {
        promises.push(
            (async () => {
                const messageId = await batchPublisher.publishMessage({
                    json: item,
                });
                logger.info('GUIAS', '182946189264', [`Mensaje publicado: ${messageId}`, 'Hola', 'Mundo']);
            })(),
        );
    }
    await Promise.all(promises);
}
