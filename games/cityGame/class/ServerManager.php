<?php

namespace Games\CityGame\Class;

class ServerManager 
{
	private $host, $db, $username, $password, $mysql;

	public function __construct($host)
	{
		//Validate params
		if(empty($host))
		{
			throw new \Exception("Host must be supplied at initialization");
		}
		//Set the host on init
		$this->host = $host;
	}

	public function __destruct()
	{
		//Clear any memory associated
		$this->mysql->close();
	}

	//#=#=#=#=#=#=#=#=#=#=#=#=#
	// SETUP CONNECTION
	//#=#=#=#=#=#=#=#=#=#=#=#=#
	public function setupDB($db, $username, $password)
	{
		//Validate params
		if(empty($host) || empty($username) || empty($password))
		{
			throw new \Exception("Could not initialize DB connection as required param was empty!");
		}

		$this->db = $db;
		$this->username = $username;
		$this->password = $password;
		$this->mysql = new \mysqli(
			$this->host, 
			$this->username, 
			$this->password, 
			$this->db
		);

		//Check connection
		if($this->mysql->connect_error)
		{
			throw new \Exception("Could not connect to DB: " . $this->mysql->connect_error);
		}
	}

	//#=#=#=#=#=#=#=#=#=#=#=#=#
	// MAIN OPERATIONS
	//#=#=#=#=#=#=#=#=#=#=#=#=#
	public function query($query, $db)
	{
		return $this->mysql->query($query);
	}
}