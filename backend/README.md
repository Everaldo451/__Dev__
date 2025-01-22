## Installation

### Windows

1. Replace `python-magic` with `python-magic-bin` in your `requirements.txt`

2. Create a virtual environment and activate it:

```bash
python -m venv venv
venv\Scripts\activate
```

3. Install the dependencies

```bash
pip install -r requirements.txt
```

### Linux

1. Install the `libmagic` library:

```bash
$ sudo apt install libmagic1
```

2. Create a virtual environment and activate it.

```bash
$ python3 -m venv venv
$ source venv/bin/activate
```

3. Install the dependencies

```bash
$ pip install -r requirements.txt
```

## Configuring

1. Create a `.env` file in the backend folder with the variables present in `.env.example`.

## Database Configuration

1. Use Flask-Migrate commands to configure your database:

```bash
flask db upgrade
```

## Running

### Windows

```bash
gunicorn -c gunicorn_config.py run:app
```

### Linux

```bash
$ gunicorn -c gunicorn_config.py run:app
```