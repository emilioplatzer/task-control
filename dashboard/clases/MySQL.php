<?php

$debug = 1;


// Clase de acceso a la base de datos. Se utiliza una sola instancia de esta clase, usando el método estático
// MySQL::getInstance(), usando el patrón de diseño "Singleton".

class MySQL {   
	private $conexion;   
	private $resource;   
	private $sql;   
	public static $queries;   
	private static $_singleton;   

	public static function getInstance(){   
		if (is_null (self::$_singleton)) {   
			self::$_singleton = new MySQL();   
		}   
		return self::$_singleton;
	}   
  
	private function __construct() {   
		// Inicia la conexión con el servidor MySQL
		$this->conexion = mysql_connect(':/cloudsql/taskcontroldevbus:tasks', null, null); 
		mysql_select_db('taskcontrol', $this->conexion);
		
		$this->queries = 0;   
		$this->resource = null;   
	}   
  
	// Ejecuta una consulta SQL (almacenada antes con el método "setQuery"
	// Debe usarse solo si la consulta devuelve contenido (p. ej. consultas del tipo SELECT, SHOW TABLES, etc)
	
	public function execute() {
		if(!($this->resource = mysql_query($this->sql, $this->conexion))) {
			return null;
		}  
		$this->queries++;   
		return $this->resource;   
	}
	
	// Ejecuta una consulta SQL (almacenada antes con el método "setQuery"
	// Debe usarse solo si la consulta no devuelve contenido (p. ej. consultas del tipo ALTER TABLE, INSERT, etc)
	public function alter() {
		if(!($this->resource = mysql_query($this->sql, $this->conexion))) {
			return false;
		}
		return true;   
	}
	
	// Devuelve un listado de objetos de la última consulta ejecutada con el método "execute"
	// Por lo general, se usa con consultas que devuelvan más de una fila de contenido
	public function loadObjectList() {
		if(!($cur = $this->execute())) {
			return null;
		}
		$array = array();   
		
		while ($row = @mysql_fetch_object($cur)) {
			$array[] = $row;   
		}
		return $array;
	}  
  

	// Almacena una consulta SQL para ejecutarla después con los método "execute" o "alter", según corresponda
	public function setQuery($sql) {
		if(empty($sql)){
		    return false;
		}
		$this->sql = $sql;
		return true;
	}

    
	// Luego de ejecutarse una consulta SQL del tipo INSERT, este método devuelve el ID del nuevo ítem insertado
	public function getId() {
		$id = $this->resource = mysql_insert_id();
		return $id;
	}
	
	// Devuelve la cantidad de filas afectadas por la última consulta ejecutada
	public function getNumRows(){
		if($cur = $this->execute()) {
			$num_rows = $this->resource = mysql_num_rows($cur);
			return $num_rows;
		}
	}
	
	// Libera recursos luego de ejecutar una consulta
	// (por lo general no es necesario, ya que PHP también administra estos recursos)
	public function freeResults() {
		@mysql_free_result($this->resource);   
		return true;
	}
	
	// Devuelve un objeto de la última consulta ejecutada con el método "execute"
	// Por lo general, se usa con consultas que devuelvan más una fila de contenido, este método devuelve dicha fila
	public function loadObject() {
		if($cur = $this->execute()) {
			if($object = mysql_fetch_object($cur)) {   
				@mysql_free_result($cur);   
				return $object;   
			}
			else {
				return null;
			}
		}
		else {
			return false;
		}
	}   
	
	// Destructor, se llama cuando termina la ejecución del script
	// Libera recursos utilizados por la conexión
	function __destruct() {
		@mysql_free_result($this->resource);
		@mysql_close($this->conexion);

	}
}

?>