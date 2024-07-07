from telethon import TelegramClient

# These example values won't work. You must get your own api_id and
# api_hash from https://my.telegram.org, under API Development.
api_id = 2597670
api_hash = 'b297821038840dd1d60a471f71105cd2'
client = TelegramClient('session_name', api_id, api_hash)
client.start()

group = 'https://t.me/Rossiya_Uzbekiston_taxi'

messages = []

async def get_messages():
    async for message in client.iter_messages(group, limit=10):
        messages.append(message)

client.loop.run_until_complete(get_messages())

print(len(messages))